package types

type EmailServerSettings struct {
	Host     string
	Port     string
	Username string
	Password string
}

type Email struct {
	FromAddress  string
	ToAddress    string
	Subject      string
	AdditionalTo []string
	CC           []string
	Attachments  []string
	Template     EmailTemplate
}

type EmailTemplate struct {
	Intros       []string
	Instructions string
	ButtonColor  string
	ButtonText   string
	ButtonLink   string
	Outros       []string
}
