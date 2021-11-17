var num_page=1;
var cant_page=10;
var id_position=0;
var id_employee=0;
var team = 3;
var id_editor= 111611;
var updates = []

const get_lob_list = async () => {
    displayLoading()
    let response = await fetch('http://127.0.0.1:8000/my_team?option=2')
    let lob_list = await response.json()
    if (team == 3) {
        await with_team()
    }
    get_my_team(lob_list)
}

const get_my_team = async (lob_list) => {
    let response = await fetch(`http://127.0.0.1:8000/my_team?option=1&num_page=${num_page}&cant_page=${cant_page}&id_position=${id_position}&id_employee=${id_employee}&switch_status=${team}&id_editor=${id_editor}`)
    let my_team = await response.json()
    await render_table(my_team, lob_list)
    await render_pagination(my_team[0].count)
    await addEvents()
}

const get_employee = async () => {
    let response = await fetch('http://127.0.0.1:8000/my_team?option=3')
    let employees = await response.json()
    render_employeeList(employees)
    render_positionList(employees)
};

const with_team = async () => {
    let response = await fetch(`http://127.0.0.1:8000/my_team?option=4&id_editor=${id_editor}`)
    let with_team = await response.json()
    const switch_status = with_team[0].with_team > 0 ? 'checked' : 'disabled'
    team= with_team[0].with_team > 0 ? 1 : 3;

    let switches = `<div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="SwitchCheck" ${switch_status}>
        <label class="form-check-label" for="SwitchCheck">My Team</label>
    </div>`

    document.getElementById("my_team").innerHTML = switches
}

const render_employeeList = (employees) => {
    let employeelist = ''
    employees.forEach(element => {
        employeelist += `<option value=${element.id_employee}>${element.shortName}</option>`
    });
    document.getElementById("employeelistOptions").innerHTML = employeelist

    document.getElementById("listPeople").addEventListener("change",(e)=>{
        num_page=1
        if(e.target.value=='') id_employee=0
        id_position=0;
        document.getElementById("positionDataList").value= '';
        id_employee=e.target.value;
        get_lob_list()
    });

}

const render_positionList = (employees) => {
    let arrayData = []
    employees.forEach((item)=>{if(!arrayData.includes(`{"position":"${item.position}","id_position":"${item.id_position}"}`))arrayData.push(`{"position":"${item.position}","id_position":"${item.id_position}"}`)})
    arrayData.sort()
    arrayData = arrayData.map(item => JSON.parse(item))
    
    let positionlist = ''
    arrayData.forEach(element => {
        positionlist += `<option data-value=${element.id_position}>${element.position}</option>`
    });
    document.getElementById("positionlistOptions").innerHTML = positionlist

    document.getElementById("listPositions").addEventListener("change",(e)=>{
        num_page=1
        var target = e.target.value
        if(target=='')id_position=0
        id_employee=0;
        document.getElementById("employeeDataList").value= '';
        
        var datalist = document.getElementById('positionlistOptions').childNodes;
            for (var i = 0; i < datalist.length; i++) {
                if (datalist[i].value === target) {
                    id_position = datalist[i].dataset.value;
                    break;
                }
            }
        get_lob_list()
    });
}


function render_table(my_team, lob_list) {
    
    let table = ''
    my_team.forEach(element => { 
        let access_lob = element.lobs.split(",").map( Number );
        let Lob_list = render_lob_list(lob_list, access_lob)
        table +=`<tr>
                    <th scope="row">${element.id_employee}</th>
                    <td>${element.shortName}</td>
                    <td>${element.position}</td>
                    <td><img src=${element.path_image} alt=${element.shortName} width="30" height="30"></td>
                    <td>
                    <button class="CTA_button btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#List${element.id_employee}" aria-expanded="false" aria-controls="collapseExample">
                        Check Permission
                    </button>
                    <div class="collapse"  name="${element.shortName}" id="List${element.id_employee}">${Lob_list}</div></td>
                </tr>`
    });  
    document.getElementById("table").innerHTML = table;
    
}

function render_lob_list(lob_list, access_lob) {
    let list = `<div>
                <ul class="list-group overflow-auto" style="position: absolute;max-width: 260px; max-height: 160px;" >`
    lob_list.forEach(element => {
        let checked = access_lob.includes(element.id_lob)? 'checked':''
        list +=`
                <li class="list-group-item" style="font-size: .75rem;"><input class="lob_check form-check-input me-1" type="checkbox" value=${element.id_lob} aria-label="..." ${checked}>${element.lob}</li>   
                `
    }); 
    list += '</ul></div>'
    return list;
}

function render_pagination(num) {
    let pagination = Math.ceil(num/cant_page)
    let index_start = num_page <= 3 ? 1 : num_page-2
    let index_end = num_page <= 3 ? 5 : num_page+2
    index_end = index_end>pagination ? pagination: index_end
    let list_pagination = ''
    
    for (index_start; index_start <= index_end; index_start++) {

        list_pagination+=`<li class="page-item ${index_start==num_page?'active':''}"><a class="page-link CTA_footer" value=${index_start}>${index_start}</a></li>`   
    }
    
    document.getElementById("pagination").innerHTML = list_pagination
}

get_lob_list()
get_employee()

function displayLoading() {
    let loading = `<tr>
                        <td colspan="5" class="text-center align-middle">
                        <div class="spinner-border text-info" style="width: 10rem; height: 10rem;" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        </td>
                   </tr>`
    document.getElementById("table").innerHTML = loading
    document.getElementById("pagination").innerHTML = ''
}

function addEvents() {
    const change_page = (e) => {
        num_page = parseInt(e.target.attributes[1].value)
        get_lob_list()
    }
    const cerrarLista = (e) => {
        const nodeList = document.querySelectorAll(".collapse")
        nodeList.forEach(list => {
            list.classList.remove("show")
        })
    }

    const addtoList = (e) => {
        var obj = new Object();
        obj.id_employee = e.currentTarget.parentNode.parentNode.parentNode.parentNode.id.replace("List", "");
        obj.shortName = e.currentTarget.parentNode.parentNode.parentNode.parentNode.getAttribute("name") ;
        obj.id_lob  = e.target.value;
        obj.lob  = e.target.parentNode.textContent;
        obj.available = e.target.checked;
        var repeated = 0
        if (updates.length == 0) {
            updates.push(obj)
        } else {
            updates.forEach(element => {
                if (element.id_employee==obj.id_employee & element.id_lob==obj.id_lob) {
                    element.available = obj.available
                    repeated=1
                }              
            });
            if (repeated==0) {
                updates.push(obj)
            }   
        }
        document.getElementById("save").style.display = 'block'  
        
        document.getElementById("save").addEventListener("click", () => {
            render_modal()
        })
    }

    const botones = document.querySelectorAll(".CTA_button");
    const pagination = document.querySelectorAll(".CTA_footer");
    const lob_checks = document.querySelectorAll(".lob_check");
    
    botones.forEach(boton => {
        boton.addEventListener("click", cerrarLista);
    });

    pagination.forEach(boton => {
        boton.addEventListener("click", change_page);
    });

    lob_checks.forEach(boton => {
        boton.addEventListener("click", addtoList);
    });

    document.getElementById("SwitchCheck").addEventListener("click", (e) =>{
        document.getElementById("positionDataList").value=''
        id_position=0;
        document.getElementById("employeeDataList").value=''
        id_employee=0;
        if(e.target.checked) {
            team = 1;
            get_lob_list()
        } else {
            team = 0;
            get_lob_list()
        }
        
    })
}

function render_modal() {
    let modal = ''
    updates.forEach(element => {
        modal += `
                <tr>
                <th scope="row">${element.shortName}</th>
                <td>${element.lob}</td>
                <td>${element.available?'<img src="https://img.icons8.com/flat-round/30/000000/checkmark.png"/>':'<img src="https://img.icons8.com/flat-round/30/000000/delete-sign.png"/>'}</td>
                </tr>
                `
    });
    document.getElementById("modal_people").innerHTML= modal
}

const send_information = async () => {
    let data = JSON.stringify(updates)
    let response = await fetch(`http://127.0.0.1:8000/my_team?option=5&data=${data}`)
    let insert = await response.json()
    document.getElementById("save").style.display = 'none'
    updates=[]
}

document.getElementById("modal-button").addEventListener("click", () => {
    send_information()
})
