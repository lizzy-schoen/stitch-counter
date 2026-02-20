# Craft Count

A hands-free row counter Alexa skill for knitting and crochet. Track your rows without putting down your needles.

**[Project page & quick reference](https://www.loosefloorboard.com/projects/craft-count)**

## Features

- **Row counting** - Say "next row" to increment, "go back" to undo
- **Multiple projects** - Create and switch between named projects
- **Smart reminders** - Set reminders for specific rows (e.g., "remind me to decrease on row 15") and get a heads-up the row before
- **Relative reminders** - Say "in 3 rows remind me to switch colors"
- **Hands-free** - Designed for quick voice interactions so you can keep knitting

## Usage

```
"Alexa, open craft count"
"Alexa, tell craft count next row"
"Alexa, ask craft count what row am I on"
```

### Projects

| Command | What it does |
|---------|-------------|
| "Create a project called blue cardigan" | Start a new project |
| "Switch to blue cardigan" | Change active project |
| "List my projects" | See all projects and their row counts |
| "Delete blue cardigan" | Remove a project (with confirmation) |

### Counting

| Command | What it does |
|---------|-------------|
| "Next row" | Increment row counter |
| "Go back a row" | Decrement row counter |
| "What row am I on" | Hear your current row |
| "Reset counter" | Reset to row 0 (with confirmation) |

### Reminders

| Command | What it does |
|---------|-------------|
| "Set a reminder for row 15" | Set a reminder at a specific row |
| "In 3 rows remind me" | Set a reminder relative to current row |
| "List my reminders" | See upcoming reminders |
| "Delete reminder for row 15" | Remove a reminder |

When you reach a row with a reminder, Craft Count announces it. It also gives you a heads-up one row before so you're prepared.

## Tech Stack

- **Runtime:** Node.js + [ASK SDK v2](https://developer.amazon.com/en-US/docs/alexa/alexa-skills-kit-sdk-for-nodejs/overview.html)
- **Backend:** AWS Lambda
- **Storage:** Amazon DynamoDB (one document per user)
- **Infrastructure:** AWS CloudFormation / SAM
- **Deployment:** ASK CLI v2

## Project Structure

```
knit-counter/
├── lambda/                  # Lambda function code
│   ├── index.js             # Entry point & handler registration
│   ├── constants.js         # Skill name, table name
│   ├── handlers/            # Intent handlers (one per file)
│   ├── interceptors/        # Load/save DynamoDB attributes
│   └── helpers/             # Reminder logic, project CRUD, fuzzy matching
├── skill-package/           # Alexa skill configuration
│   ├── skill.json           # Skill manifest
│   ├── assets/images/       # Skill icons (108x108, 512x512)
│   └── interactionModels/   # Voice interaction model
├── infrastructure/          # SAM/CloudFormation template
├── docs/                    # Privacy policy (GitHub Pages)
└── test/                    # Unit tests
```

## Development

### Prerequisites

- [ASK CLI v2](https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html)
- AWS account with Lambda and DynamoDB access
- Amazon Developer account

### Deploy

```bash
ask deploy
```

This deploys the skill metadata, builds and uploads the Lambda code, and provisions the DynamoDB table via CloudFormation.

## Privacy

Craft Count stores only your Alexa user ID, project names, row counts, and reminders. No personal information is collected or shared. See the full [privacy policy](https://lizzy-schoen.github.io/craft-count/privacy-policy.html).

## License

MIT
