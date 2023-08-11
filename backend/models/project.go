package models

import (
	"database/sql"
	"errors"
	"fmt"
	"github.com/woojiahao/notify.me/db"
	"github.com/woojiahao/notify.me/forms"
	"time"
)

type ProjectUserRole string

const (
	Admin  ProjectUserRole = "admin"
	Member ProjectUserRole = "member"
	Viewer ProjectUserRole = "viewer"
)

type Project struct {
	ID        string        `json:"id,omitempty"`
	Name      string        `json:"name"`
	CreatedBy User          `json:"created_by"`
	CreatedAt string        `json:"created_at"`
	UpdatedBy *User         `json:"updated_by,omitempty"`
	UpdatedAt *time.Time    `json:"updated_at,omitempty"`
	Users     []ProjectUser `json:"users"`
}

type ProjectUser struct {
	User User            `json:"user"`
	Role ProjectUserRole `json:"role"`
}

var (
	ProjectNotFound        = errors.New("project not found")
	ProjectCreateFail      = errors.New("failed to create project")
	ProjectParseError      = errors.New("failed to parse projects row")
	ProjectAssignUserError = errors.New("failed to assign user to project")
)

func (p Project) Create(createProjectPayload forms.CreateProject) (*Project, error) {
	// TODO: Wrap inside transaction
	conn := db.GetDB()
	// Create the project
	rows, err := conn.Query(
		"INSERT INTO projects (name, created_by) VALUES ($1, $2) RETURNING id",
		createProjectPayload.Name,
		createProjectPayload.UserID,
	)
	if err != nil {
		return nil, ProjectCreateFail
	}

	var projectId string
	if !rows.Next() {
		return nil, ProjectParseError
	}
	err = rows.Scan(&projectId)

	if err != nil {
		return nil, ProjectParseError
	}

	// Assign the creator of the project as the admin
	result, err := conn.Exec(
		"INSERT INTO user_projects (user_id, project_id, role) VALUES ($1, $2, $3)",
		createProjectPayload.UserID,
		projectId,
		Admin,
	)
	if rows, _ := result.RowsAffected(); rows != 1 || err != nil {
		return nil, ProjectAssignUserError
	}

	// Retrieve the project
	return p.FindById(projectId)
}

func (p Project) FindById(projectId string) (*Project, error) {
	conn := db.GetDB()
	rows, err := conn.Query(`
	SELECT
	    p.id,
	    p.name,
	    p.created_at,
	    p.updated_at,
	    created_by_user.id,
	    created_by_user.name,
	    created_by_user.email,
	    updated_by_user.id,
	    updated_by_user.name,
	    updated_by_user.email,
	    project_user.id,
	    project_user.name,
	    project_user.email,
	    user_projects.role
	FROM projects p
	    JOIN user_projects ON p.id = user_projects.project_id
		JOIN users created_by_user ON p.created_by = created_by_user.id
		LEFT JOIN users updated_by_user ON p.updated_by = updated_by_user.id
		JOIN users project_user ON user_projects.user_id = project_user.id
	WHERE p.id = $1;
	`, projectId)
	if err != nil {
		return nil, ProjectNotFound
	}

	project := Project{}
	for rows.Next() {
		createdByUser := User{}
		var updatedByUserID sql.NullString
		var updatedByUserName sql.NullString
		var updatedByUserEmail sql.NullString
		projectUser := ProjectUser{}
		err := rows.Scan(
			&project.ID,
			&project.Name,
			&project.CreatedAt,
			&project.UpdatedAt,
			&createdByUser.ID,
			&createdByUser.Name,
			&createdByUser.Email,
			&updatedByUserID,
			&updatedByUserName,
			&updatedByUserEmail,
			&projectUser.User.ID,
			&projectUser.User.Name,
			&projectUser.User.Email,
			&projectUser.Role,
		)
		if err != nil {
			return nil, ProjectParseError
		}
		if updatedByUserEmail.Valid && updatedByUserID.Valid && updatedByUserName.Valid {
			project.UpdatedBy = &User{
				ID:    updatedByUserID.String,
				Name:  updatedByUserName.String,
				Email: updatedByUserEmail.String,
			}
		} else {
			project.UpdatedBy = nil
		}
		project.CreatedBy = createdByUser
		project.Users = append(project.Users, projectUser)
	}
	fmt.Printf("%+v", project)

	return &project, nil
}
