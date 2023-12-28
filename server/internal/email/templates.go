package email

import (
	"github.com/HeadLikeAHole/banana/server/internal/types"
	"github.com/matcornic/hermes/v2"
)

func generateEmailTemplate(t types.EmailTemplate) (string, string, error) {
	h := hermes.Hermes{
		// Optional Theme
		// Theme: new(Default)
		Product: hermes.Product{
			// Appears in header & footer of e-mails
			Name: "Banana",
			Link: "",
			// Optional product logo
			Logo: "",
		},
	}

	email := hermes.Email{
		Body: hermes.Body{
			Name:   "dear user",
			Intros: t.Intros,
			Actions: []hermes.Action{
				{
					Instructions: t.Instructions,
					Button: hermes.Button{
						Color: t.ButtonColor, // Optional action button color
						Text:  t.ButtonText,
						Link:  t.ButtonLink,
					},
				},
			},
			Outros: t.Outros,
		},
	}

	// Generate the plaintext version of the e-mail (for clients that do not support xHTML)
	plainText, err := h.GeneratePlainText(email)
	if err != nil {
		return "", "", err
	}

	// Generate an HTML email with the provided contents (for modern clients)
	html, err := h.GenerateHTML(email)
	if err != nil {
		return "", "", err
	}

	return plainText, html, nil
}
