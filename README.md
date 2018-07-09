# CryptoTicker
Crypto Ticker is a Gnome extension that get the current live price of a large number of ticker from Binance servers and show it in your panel.

### How to install it
1. Download or clone this repository
2. Copy the folder 'cryptoTicker@Ricx8' to '~/.local/share/gnome-shell/extensions/'
3. Go to Tweaks > Extensions and activate CryptoTicker

### How to use it
Inside of the 'cryptoTicker@Ricx8' folder, there is the conf file call [settings.conf](cryptoTicker@Ricx8/settings.conf). This file is in JSON format and contains a list with all the ticker that you want to display. Every line has two values:
- coin: ticker name.
- toFixed: show N decimals

note: The first line is going to be the ticker show in the panel.

### Tested on:
- Gnome 3.28.1 (Ubuntu)

### Contributing
1. Fork it
2. Create a new branch with a meaningful name (git checkout -b newFeature)
3. Add yourself to the [CONTRIBUTORS.md](CONTRIBUTORS.md
) file
4. Commit changes (git commit -m 'Changes made')
5. Push to your branch (git push origin newFeature)
6. Create a new pull request


### License
Release under the [GNU General Public License v2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html). See [LICENSE](LICENSE) file for details.
