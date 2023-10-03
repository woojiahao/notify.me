package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/woojiahao/notify.me/forms"
	"github.com/woojiahao/notify.me/models"
	"net/http"
)

type CollectionController struct{}

var collectionModel = new(models.Collection)

func (cc CollectionController) Create(c *gin.Context) {
	projectId := c.Param("id")
	var createCollectionPayload forms.CreateCollection
	if err := c.Bind(&createCollectionPayload); err != nil {
		SetStatusAndError(c, http.StatusBadRequest, err)
		return
	}

	collection, err := collectionModel.Create(createCollectionPayload, projectId)
	if err != nil {
		SetStatusAndError(c, http.StatusInternalServerError, err)
		return
	}

	c.JSON(200, collection)
}

func (cc CollectionController) FindAllInProject(c *gin.Context) {
	projectId := c.Param("id")
	collections, err := collectionModel.FindAllByProjectId(projectId)
	if err != nil {
		SetStatusAndError(c, http.StatusInternalServerError, err)
		return
	}

	c.JSON(200, collections)
}
