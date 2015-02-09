# Internet speed tester
Application for testing internet speed by running automatic tests.
Used to firmly test the internet capability in 24/7 time period and to visualy show the results.

## TO-DO
- [x] Create logging
- [ ] Add data visualization using d3.js
- [ ] Per hour chart for download/upload
- [ ] Per hour chart for ping
- [ ] Per day chart

## Usage
```bash
# 1. clone the repo
git clone https://github.com/renarsvilnis/internet-speed-tester.git

# 2. cd into it
cd internet-speed-tester

# 3. install dependencies
npm install

# 4. make crontab
crontab -e
# then inside of editor add cronjob that launches the speed test script every 5 minutes. Just make sure to change the path to repo!
# NOTE - node path may differ depending on system, check path by running "which node"
*/5 * * * * /usr/local/bin/node /path/to/repo/app.js

# 5. ???

# 6. Profit
```

To see data visualizations open `index.html`.

## Author
Created by [Renārs Vilnis](https://twitter.com/RenarsVilnis)

## License
License under MIT
