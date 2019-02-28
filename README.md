# czu-api

Essential api package for Czech University of Life Sciences Prague.

## Installation
```bash
yarn add czu-api
```

## Usage
```typescript
import UisApi from 'czu-api';

(async () => {
    const uis = new UisApi({username: 'xname015', password: 'hunter2'});

    await uis.login();

    const timetableJSON = await uis.getTimetable();

    console.log(timetableJSON);
})()
```

## Upcoming features
* uep support
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