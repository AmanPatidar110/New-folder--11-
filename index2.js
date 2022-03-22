const puppeteer = require('puppeteer')

class AddToWishList {
  constructor () {}

  async start () {
    try {
      const browser = await puppeteer.launch({ headless: false })
      this.page = await browser.newPage()
      await this.page.goto(
        'https://www.buzzfeed.com/nusrat21/things-so-amazing-youll-break-into-song-dance',
        { waitUntil: 'domcontentloaded', timeout: 0 }
      )
      this.page.waitForSelector(
        'button.wishlist-button_button__Bkgar.wishlist-button_wishButton__r__5E'
      )
      this.wishListButtons = await this.page.$$(
        'button.wishlist-button_button__Bkgar.wishlist-button_wishButton__r__5E'
      )
      // console.log("wishLIST",this.wishListButtons[0]);
      const strings = await this.page.evaluate(async () => {
        this.subBuzzes = document.querySelectorAll(
          '.buzz--list.buzz--Shopping.subbuzzes-wrapper.subbuzzes--buzzfeed .js-subbuzz-wrapper'
        )

        let strings = []

        for (let index = 0; index < this.subBuzzes.length; index++) {
          const paraNode = this.subBuzzes[index].querySelector(
            '.subbuzz__description'
          )
          const dollarSplit = paraNode.innerText.split('$')
          const str = dollarSplit[dollarSplit.length - 1] || '0'
          strings.push(str)
        }

        return [...strings]
      })

      for (let index = 0; index < strings.length; index++) {
        const price = this.getPrice(strings[index])
        console.log(price)
        if (price > 25) {
          if (index < 4) {
            try {
              await this.wishListButtons[index].click()
              console.log('CLICKED ON INDEX', index)
            } catch (error) {
              console.log(error)
            }
          } else if (index > 4) {
            try {
              await this.wishListButtons[index - 1].click()
              console.log('CLICKED ON INDEX', index)
            } catch (error) {
              console.log(error)
            }
          }
          await this.page.waitForTimeout(2000);
        }
      }

      //   await browser.close()
    } catch (error) {
      console.log(error)
    }
  }

  getPrice (str) {
    if (!str) return 0
    let price = ''
    let decimalCount = 0
    for (let index = 0; index < str.length; index++) {
      const letter = str[index]
      if ((letter >= '0' && letter <= '9') || letter === '.') {
        if (letter === '.') decimalCount++
        if (decimalCount > 1) break
        price += letter
      } else break
    }

    return parseFloat(price)
  }
}

const addToWishlist = new AddToWishList()
addToWishlist.start()
