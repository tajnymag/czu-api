# czu-cli

As simple cli as possible for Czech University of Life Sciences Prague.

Currently supports only extraction and conversion of student's timetable.

## Installation
```bash
git clone https://github.com/Tajnymag/czu-cli
cd czu-cli
yarn install && yarn build
```

## Run
```bash
# help
yarn cli --help

# print current timetable as iCalendar
yarn cli timetable --username "xlukm014" --password "hunter2" --format ics
```

## Upcoming features
* easier installation (precompiled binary)
* uemp support
* searching for empty classroom
* monitoring of timetable changes

## Goals
* provide quick and secure access to your UIS
* fix errors caused by incorrectly exported iCalendar by UIS
* cover all desired features by request of other students

## Contributing
1. Create a Github account
2. Fork this repo
3. Download your forked version to your computer
4. Change/Add the stuff you want
5. Push/Sync your changes back to your repository
6. Submit a pull-request back into this repo