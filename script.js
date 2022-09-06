
const userHeads = ["name", "intial balance"];
const addForm = document.querySelector("#addForm")
const dataWrap = document.querySelector("#dataWrap")
const single = document.querySelector("#single")
const input = document.querySelector(".input");


const readFromStorage = (key= "users", dataType="array") => {
    let data
    try{
        data = JSON.parse(localStorage.getItem(key)) || []
        if(!Array.isArray(data) && dataType=="array") throw new Error("data is not an array")
    }
    catch(e){
        data = []
    }
    return data
}

const writeToStorage = (data, key="users") => {
    localStorage.setItem(key, JSON.stringify(data))
}

const createUserObject = (addForm) =>{
    let user = { id: Date.now(), "remaining balance": addForm.elements["intial balance"].value };
    userHeads.forEach(head => user[head]= addForm.elements[head].value)
    return user 
}
const createMyOwnEle = (eleTag, parent, txtContent=null, classes=null) =>{
    const myNewElement = document.createElement(eleTag)
    if(classes)  myNewElement.classList = classes
    if(txtContent) myNewElement.innerText= txtContent
    parent.appendChild(myNewElement)
    return myNewElement
}
const delUser = (users, i)=>{
    users.splice(i,1)
    writeToStorage(users)
    draw(users)
}
const showSingle = (user, operText)=>{
    writeToStorage({ ...user,  oper: operText} , "user")
    window.location.href = "single.html"
}
const draw = (users) => {
    dataWrap.innerHTML=""
    if(users.length==0){
        let tr = createMyOwnEle("tr", dataWrap, null, "alert alert-danger")
        let td = createMyOwnEle("td", tr, "no data found", "alert alert-danger")
        td.setAttribute("colspan", "5")
    }
    users.forEach((user, i)=>{
        let tr = createMyOwnEle("tr", dataWrap)
        createMyOwnEle("td", tr, user.id)
        createMyOwnEle("td", tr, user.name)
        createMyOwnEle("td", tr, user["intial balance"])
        createMyOwnEle("td", tr, user["remaining balance"])
        let td = createMyOwnEle("td", tr)
        
        

        let addBalance = createMyOwnEle("button", td, "Add Balance", "btn btn-primary mx-2")
        addBalance.addEventListener("click", () => showSingle(users[i], "Add"))

        let withDraw = createMyOwnEle("button", td, "Withdraw", "btn btn-warning mx-2")
        withDraw.addEventListener("click", () => showSingle(users[i], "Withdraw"))

        let del = createMyOwnEle("button", td, "Delete", "btn btn-danger mx-2")
        del.addEventListener("click", () => delUser(users, i));
    })
}

if(addForm){
    addForm.addEventListener("submit", function(e){
        e.preventDefault()
        const user = createUserObject(this)
        const users = readFromStorage()
        users.push(user)
        writeToStorage(users)
        window.location.href="index.html"
    })
}

if(dataWrap) {
    const users = readFromStorage()
    draw(users)
}

const handleErrors = (val, user) => {
    if (Number.isNaN(val)) {
        errorElement.innerHTML = "Please enter Valid Number";
        return true;
    }
    if (user.oper === "Add" && val > 5000) {
        errorElement.innerHTML = "Can`t Add more than 5000";
        return true;
    }
    if (user.oper === "Withdraw" && val > +user["remaining balance"]) {
        errorElement.innerHTML = "Can`t withdraw more than your balance";
        return true;
    }
    return false;
}


const action = (user) => {
    let value = Number(input.value);
    if (!handleErrors(value, user)) {
        user["remaining balance"] = user.oper === "Add" ? String(+user["remaining balance"] + value) : String(+user["remaining balance"] - value);
        let users = readFromStorage("users");
        let index = users.findIndex((u => u.id === user.id));
        users[index] = user;
        writeToStorage(users, "users");
        window.location.href = './index.html';
    }
}

if (single) {
    let user = readFromStorage("user", "object");
    let button = createMyOwnEle("button", single, user.oper);
    errorElement = createMyOwnEle("div", single);
    button.addEventListener("click", (e)=> action(user));
}





