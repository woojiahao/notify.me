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
