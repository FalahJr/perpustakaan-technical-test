package user

import (
	"github.com/afrizal423/Golang-Perpustakaan-Restful-API/internal/core/ports"
	"github.com/gofiber/fiber/v2"
)

type Controller struct {
	service ports.IUserService
}

func NewUserController(service ports.IUserService) *Controller {
	return &Controller{
		service,
	}
}

func (c *Controller) GetAllAnggota(f *fiber.Ctx) error {
	data, err := c.service.GetAllAnggota()
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}
	return f.Status(fiber.StatusOK).JSON(fiber.Map{
		"error": false,
		"msg":   "Success get all anggota",
		"data":  data,
	})
}
