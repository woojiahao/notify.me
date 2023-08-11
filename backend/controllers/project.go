package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/woojiahao/notify.me/forms"
	"github.com/woojiahao/notify.me/models"
	"net/http"
)

type ProjectController struct{}

var projectModel = new(models.Project)

func (p ProjectController) Create(c *gin.Context) {
	var createProjectPayload forms.CreateProject
	if err := c.Bind(&createProjectPayload); err != nil {
		SetStatusAndError(c, http.StatusBadRequest, err)
		return
	}

	project, err := projectModel.Create(createProjectPayload)
	if err != nil {
		SetStatusAndError(c, http.StatusInternalServerError, err)
		return
	}

	c.JSON(200, project)
}

func (p ProjectController) FindByID(c *gin.Context) {
	projectId := c.Param("id")
	project, err := projectModel.FindById(projectId)
	if err != nil {
		if err == models.ProjectNotFound {
			SetStatusAndError(c, http.StatusNotFound, err)
		} else {
			SetStatusAndError(c, http.StatusInternalServerError, err)
		}
		return
	}

	c.JSON(200, project)
}

func (p ProjectController) FindAll(c *gin.Context) {
	userId := c.Param("id")
	projects, err := projectModel.FindAll(userId)
	if err != nil || len(projects) == 0 {
		if len(projects) == 0 || err == models.ProjectNotFound {
			SetStatusAndError(c, http.StatusNotFound, err)
		} else {
			SetStatusAndError(c, http.StatusInternalServerError, err)
		}
		return
	}

	c.JSON(200, projects)
}
