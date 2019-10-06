const fs = require('fs')

var args = process.argv.slice(2)

const infile = args[0]
const action = args[1]

switch (action) {
    case 'search_seller':
        console.log('=== Starting search_seller ===')
        console.log('[~] INFILE:' + infile)
        console.log('[~] SELLER: ' + args[2])
        search_seller(args[2])
        break

    case 'dump':
        console.log('=== Starting dump to csv... ===')
        console.log('[~] INFILE:' + infile)
        console.log('[~] OUTFILE: ' + args[2])
        dump(infile, args[2])
        break

    default:
        console.log('No action specified')
}

function dump(infile, outfile) {
    var start = new Date()
    var ts = start.toISOString()

    var items = getItems(infile)
    console.log(`[+] Dumping from ${infile} to ${outfile}`)
    const header = 'ts,name,quantity,bid,buyout,seller\r\n'
    fs.writeFileSync(outfile, header)
    for (var i = 0; i < items.length; i++) {
        fs.appendFileSync(outfile, `${ts},${items[i].name},${items[i].quantity},${items[i].bid},${items[i].buyout},${items[i].seller}\r\n`)
    }
    console.log(`[+] Wrote ${items.length}!`)
}

function search_seller(seller) {
    var start = new Date()

    var items = getItems(infile)
    console.log(`[+] Searching ${items.length} items for seller ${seller}...`)
    var res = items.filter(x => x.seller == seller)
    var end = new Date() - start
    console.log('[+] Got %d items in %dms', res.length, end)
    res.map(i => {
        console.log(`${i.name} x ${i.quantity} => ${i.bid} | ${i.buyout}`)
    })
}

function getItems(file) {
    try {
        var c = fs.readFileSync(file)
        var items = c.toString().split(`},{\\"`)

        var res = []

        for (var i = 1; i < items.length; i++) {
            res.push(parseRope(items[i]))
        }

        return res
    } catch (e) {
        console.log(`ERROR: ${e}`)
    }
}

function cleanRope(rope) {
    var c = rope.replace(/['"]+/g, '').replace(/\\/g, '')
    return c
}

function parseRope(rope) {
    var cleaned = cleanRope(rope)
    var parts = cleaned.split(',')

    const item_obj = {
        name: parts[8],
        quantity: parts[10],
        bid: parts[14],
        buyout: parts[16],
        seller: parts[19],
    }

    return item_obj
}


