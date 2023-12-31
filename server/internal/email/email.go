package email

import (
	"github.com/HeadLikeAHole/banana/server/internal/types"
	"github.com/matcornic/hermes/v2"
	mail "github.com/xhit/go-simple-mail/v2"
	"strconv"
	"time"
)

var (
	app      *types.AppConfig
	settings types.EmailServerSettings
)

type Dispatcher struct {
	maxWorkers int
}

func NewDispatcher(a *types.AppConfig, s types.EmailServerSettings, maxWorkers int) *Dispatcher {
	app = a
	settings = s

	return &Dispatcher{maxWorkers: maxWorkers}
}

func (d *Dispatcher) Run() {
	for i := 0; i < d.maxWorkers; i++ {
		go func() {
			for email := range app.EmailQueue {
				d.send(email)
			}
		}()
	}
}

func (d *Dispatcher) send(msg types.Email) {
	server := mail.NewSMTPClient()
	server.Host = settings.Host
	port, err := strconv.Atoi(settings.Port)
	if err != nil {
		app.ErrorLog.Println(err)
	}
	server.Port = port
	server.Username = settings.Username
	server.Password = settings.Password
	server.Encryption = mail.EncryptionSSLTLS
	server.ConnectTimeout = 10 * time.Second
	server.KeepAlive = false

	smtpClient, err := server.Connect()
	if err != nil {
		app.ErrorLog.Println(err)
		return
	}

	email := mail.NewMSG()
	email.SetFrom(msg.FromAddress).AddTo(msg.ToAddress).SetSubject(msg.Subject)

	if len(msg.AdditionalTo) > 0 {
		for _, item := range msg.AdditionalTo {
			email.AddTo(item)
		}
	}

	if len(msg.CC) > 0 {
		for _, item := range msg.CC {
			email.AddCc(item)
		}
	}

	if len(msg.Attachments) > 0 {
		for _, item := range msg.Attachments {
			email.AddAttachment(item)
		}
	}

	plainText, html, err := d.generateEmailTemplate(msg.Template)
	if err != nil {
		app.ErrorLog.Println(err)
	}
	email.SetBody(mail.TextPlain, plainText)
	email.AddAlternative(mail.TextHTML, html)

	err = email.Send(smtpClient)
	if err != nil {
		app.ErrorLog.Println(err)
	} else {
		app.InfoLog.Println("Email sent!")
	}
}

func (d *Dispatcher) generateEmailTemplate(t types.EmailTemplate) (string, string, error) {
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
