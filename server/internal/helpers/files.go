package helpers

import (
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

const maxUploadSize = 1 << 20 // 1MB

func SaveFile(fileHeader *multipart.FileHeader, productID int64) error {
	// Restrict the size of each uploaded file to 1MB
	// To prevent the aggregate size from exceeding
	// a specified value, use the http.MaxBytesReader() method
	// before calling ParseMultipartForm()
	if fileHeader.Size > maxUploadSize {
		return errors.New(fmt.Sprintf("The uploaded image is too big: %s. Please use an image less than 1MB in size", fileHeader.Filename))
	}

	// Open the file
	file, err := fileHeader.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	buff := make([]byte, 512)
	_, err = file.Read(buff)
	if err != nil {
		return err
	}
	fileType := http.DetectContentType(buff)
	if fileType != "image/jpeg" && fileType != "image/png" {
		return errors.New("The provided file format is not allowed. Please upload a JPEG or PNG image")
	}

	// file.Seek() method is used to return the pointer back to the start
	// of the file so that io.Copy() starts from the beginning
	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		return err
	}

	err = os.MkdirAll(fmt.Sprintf("./static/images/products/%d", productID), os.ModePerm)
	if err != nil {
		return err
	}

	newFile, err := os.Create(fmt.Sprintf("./static/images/products/%d/%s", productID, fileHeader.Filename))
	if err != nil {
		return err
	}
	defer newFile.Close()

	_, err = io.Copy(newFile, file)
	if err != nil {
		return err
	}

	return nil
}
