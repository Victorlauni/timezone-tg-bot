# timezone-tg-bot

## Description
A simple bot which allow user to check time and date of different timezone.

## Commands
Currently the bot support the following commands:
- start - get welcome msg
- addchattimezone - <timezone> <alias (optional)>: add timezone to current chat
- removechattimezone - <timezone>: remove timezone from current chat
- listchattimezone - get a list of active timezone
- gettimeof - <time in format YYYY-MM-DD hh:mm> <timezone/alias name>: get time in multiple timezone
- getnow - get current time in multiple timezone

## Deployment
For production, the bot backend is deployed to vercel and the database is deployed to supabase
