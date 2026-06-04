package ports

import (
	"github.com/afrizal423/Golang-Perpustakaan-Restful-API/internal/core/domain"
	"github.com/afrizal423/Golang-Perpustakaan-Restful-API/internal/infrastructure/http/v1/user/user_response"
)

type IUserService interface {
	Login(username string, password string) (*user_response.LoginResponse, error)
	GetAllAnggota() ([]domain.Anggota, error)
}

type IUserRepository interface {
	GetDataByUsername(username string) (*domain.Pegawai, error)
	GetAllAnggota() ([]domain.Anggota, error)
}
