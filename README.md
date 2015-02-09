# Internet speed tester
Application for testing internet speed by running automatic tests.
Used to firmly test the internet capability in 24/7 time period and to visualy show the results.

## TO-DO
- [x] Create logging
- [ ] Per hour chart for download/upload
- [ ] Per hour chart for ping
- [ ] Per day chart

## Dependencies
- Node.js + NPM
- Bower
- Gulp

## Usage
__Too collect speed data:__

1. clone the repo
    ```bash
    git clone https://github.com/renarsvilnis/internet-speed-tester.git
    ```

2. cd into it
    ```bash
    cd internet-speed-tester
    ```

3. install dependencies
    ```bash
    npm install
    ```

4. make crontab
    ```bash
    crontab -e
    ```
Then inside of editor add cronjob that launches the speed test script every 5 minutes.

>Just make sure to change the path to folder.
> Node path may differ depending on system, check path by running `which node`

```
*/5 * * * * /usr/local/bin/node /path/to/repo/app.js
```


__To see data visualizations:__

1. install dependencies
    ```bash
    bower install
    ```

2. build assets
    ```bash
    gulp dist
    ```

3. open `index.html`

## Author
Created by [Renārs Vilnis](https://twitter.com/RenarsVilnis)

## License
License under MIT
