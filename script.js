let bucketEl = document.querySelector('#bucket') 
let productsEl = document.querySelector('#products')
let balanceEl = document.querySelector('.balance') 
const form = { 
    input: document.querySelector('.InputReplenish'),
    btn: document.querySelector('.btnBalnce')
}

const writeBalance = () => {
    balanceEl.innerHTML = `
    Balance: ${localStorage.getItem('balance')}$
    `
}

const setBalance = (value = 0) => {
    localStorage.setItem('balance', value)
    writeBalance()
}

setBalance()

form.btn.addEventListener('click', () => {
    let balanceCurrent = parseInt(localStorage.getItem('balance'))
    let valueAdd  = parseInt(form.input.value)
    setBalance(balanceCurrent+valueAdd)
    form.input.value = ''
})

let summary = { 
    value: document.querySelector('.summary'),
    count: document.querySelector('.count'),
    btns: { 
        minus: document.querySelector('.btnMinus'),
        plus: document.querySelector('.btnPlus')
    }
}

let productsStore = [ 
    { 
        id: 1, 
        name: "Samsung A32", 
        price: 7500 
    }, 
    { 
        id: 2, 
        name: "Samsung S21", 
        price: 11500 
    }, 
    { 
        id: 3, 
        name: "Samsung S22", 
        price: 10000 
    } 
 
] 



let bucketStore = [] 
 
const removeProduct = (idToRemove) => { 
    productsStore = productsStore.filter(product => {
        if (product.id != idToRemove){
            return product
        }
    })
    generateProducts()
}

const removeBucket = (idToRemove) => {
    bucketStore = bucketStore.filter(bucketItem => {
        if(bucketItem.id != idToRemove){
            return bucketItem
        }
    })
    generateBucket()
}

const findItemInArray = (array, id) => { 
    let currentIndex
    array.forEach((item, index) => { 
        if (item.id == id){
            currentIndex = index
        }
    })
    return currentIndex
}
 
const generateProducts = () => { 
    productsEl.innerHTML = "" 
    productsStore.forEach(product=>{ 
        if (product.status != "delete") { 
            productsEl.innerHTML += ` 
            <div id="product-${product.id}" class="cards"> 
                <img src="./samsung-a32.svg">
                <p class="name">${product.name}</p> 
                <p class="price" id="price-${product.id}">${product.price} грн</p>
                <button class="btnAdd" id="add-${product.id}">Add to bucket</button> 
                <div class="prices" id="price-${product.id}">
                    <button class="btnMinus" id="btnMinus-${product.id}">-</button>
                    <p class="count" id="count-${product.id}">Count: 1</p>
                    <button class="btnPlus" id="btnPlus-${product.id}">+</button>
                </div>
            </div> 
            ` 
        } 
    }) 
    const btnsMinus = document.querySelectorAll('.btnMinus')
    const btnsPlus = document.querySelectorAll('.btnPlus')
    btnsPlus.forEach((btn) => {
        btn.addEventListener('click', () => { 
            let currentId = parseInt(btn.parentNode.id.substring(6))
            let price = productsStore[findItemInArray(productsStore, currentId)].price
            if (productsStore[findItemInArray(productsStore, currentId)].count) {
                productsStore[findItemInArray(productsStore, currentId)].count += 1
            } else { 
                productsStore[findItemInArray(productsStore, currentId)].count = 2
            }
            document.querySelector(`#price-${currentId}`).innerHTML = price * productsStore[findItemInArray(productsStore, currentId)].count
            document.querySelector(`#count-${currentId}`).innerHTML = `Count: ${productsStore[findItemInArray(productsStore, currentId)].count}`
        })
    })
    btnsMinus.forEach((btn) => {
        btn.addEventListener('click', () => { 
            
            let currentId = parseInt(btn.parentNode.id.substring(6))
            if(productsStore[findItemInArray(productsStore, currentId)].count || productsStore[findItemInArray(productsStore, currentId)].count > 1) {
                let price = productItem.price
                productItem.count -= 1
                document.querySelector(`#price-${currentId}`).innerHTML = price * productsStore[findItemInArray(productsStore, currentId)].count
                document.querySelector(`#count-${currentId}`).innerHTML = `Count: ${productsStore[findItemInArray(productsStore, currentId)].count}`
            }
        })
    })
    let btnsAdd = document.querySelectorAll('.btnAdd')
    btnsAdd.forEach((btnItem) => { 
        btnItem.addEventListener('click', () => { 
            let currentId = parseInt(btnItem.parentNode.id.substring(8))
            console.log(currentId)
            let balanceCurrent = parseInt(localStorage.getItem('balance'))
            let productItem = productsStore[findItemInArray(productsStore, currentId)]
            let price = 0
            if (productItem.count){
                price = productItem.price * productItem.count
            } else { 
                price = productsStore[findItemInArray(productsStore, currentId)].price
            }
            if (balanceCurrent - price >= 0) {
                bucketStore = [
                    ...bucketStore,
                    {...productsStore[findItemInArray(productsStore, currentId)]}
                ]
                removeProduct(currentId)
                generateBucket()
                setBalance(balanceCurrent-price)
            } else { 
                alert("You can't add this product on bucket")
            }
        })
    })
} 

const generateBucket = () => {  
    bucketEl.innerHTML = "" 
    bucketStore.forEach((bucketItem) => { 
        bucketEl.innerHTML += ` 
        <div id="bucket-${bucketItem.id}" class="cards"> 
            <img src="./samsung-a32.svg"> 
            <p class="name">${bucketItem.name}</p> 
            <p class="price">${bucketItem.price} грн</p> 
            <button class="btnRemove">Remove</button>
        </div> 
        ` 
    }) 
    let btnsRemove = document.querySelectorAll('.btnRemove')
    btnsRemove.forEach((btnItem)=> {
        btnItem.addEventListener('click', () => {
            let currentId = parseInt(btnItem.parentNode.id.substring(7))
        productsStore = [
            ...productsStore, 
            {...bucketStore[findItemInArray(bucketStore, currentId)]}
        ]
        let balanceCurrent = parseInt(localStorage.getItem('balance'))
        let price = bucketStore[findItemInArray(bucketStore, currentId)].price
        setBalance(balanceCurrent+price)
        removeBucket(currentId)
        generateProducts()
        
        })
    })
}

generateProducts()

