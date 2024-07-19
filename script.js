class Person {
    constructor(name, address, email, phone_number, birthdate) {
        this.name = name;
        this.address = address;
        this.email = email;
        this.phone_number = phone_number;
        this.birthdate = new Date(birthdate);
    }

    calcAge() {
        const today = new Date();
        let age = today.getFullYear() - this.birthdate.getFullYear();
        const monthDifference = today.getMonth() - this.birthdate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < this.birthdate.getDate())) {
            age--;
        }
        return age;
    }
}

class User extends Person {
    constructor(name, address, email, phone_number, birthdate, job, company) {
        super(name, address, email, phone_number, birthdate);
        this.job = job;
        this.company = company;
    }

    isRetired() {
        return this.calcAge() > 65;
    }
}

const users = [];
let currentPage = 1;
const recordsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.npoint.io/9cda598e0693b49ef1eb')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                users.push(new User(user.name, user.address, user.email, user.phone_number, user.birthdate, user.job, user.company));
            });
            (displayUsers)();
        })
        .catch(error => console.error('Error fetching data:', error));

    document.getElementById('search-input').addEventListener('input', () => {
        currentPage = 1;
        displayUsers();
    });

    document.getElementById('previous-button').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayUsers();
        }
    });

    document.getElementById('next-button').addEventListener('click', () => {
        if (currentPage < Math.ceil(getFilteredUsers().length / recordsPerPage)) {
            currentPage++;
            displayUsers();
        }
    });
});

function getFilteredUsers() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    return users.filter(user => user.name.toLowerCase().includes(searchQuery) || user.email.toLowerCase().includes(searchQuery));
}


function displayUsers(){
    const usertbody = document.getElementById('table-body');
    usertbody.innerHTML = '';
    const filteredUsers = getFilteredUsers();
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, filteredUsers.length);

    for(let i = startIndex; i < endIndex; i++){
        const user = filteredUsers[i];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.address}</td>
            <td>${user.email}</td>
            <td>${user.phone_number}</td>
            <td>${user.job}</td>
            <td>${user.company}</td>
            <td>${user.calcAge()}</td>
            <td>${user.isRetired()}</td>
        `
        usertbody.appendChild(row)
    }
    document.getElementById('pagination-info').textContent =  `Page ${currentPage} of ${Math.ceil(filteredUsers.length / recordsPerPage)}`;
}
