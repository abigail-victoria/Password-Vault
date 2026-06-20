const API_URL =
    "http://localhost:5000/api";

const token =
    localStorage.getItem("token");

if (!token) {

    window.location.href =
        "login.html";

}


// LOAD PASSWORDS

async function loadPasswords() {

    try {

        const response =
            await fetch(
                `${API_URL}/passwords`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const passwords =
            await response.json();

        const table =
            document.getElementById(
                "passwordTable"
            );

        table.innerHTML = "";

        passwords.forEach(item => {

            table.innerHTML += `
            
            <tr>

            <td>
                ${item.app_name}
            </td>

            <td>
                ${item.username}
            </td>

            <td>

                <div class="input-group">

                <input
                type="password"
                value="${item.password}"
                class="form-control password-field"
                readonly>

                <button
                class="btn btn-outline-light"
                onclick="togglePassword(this)"
                type="button">

                <i class="bi bi-eye"></i>

                </button>

                </div>

            </td>

            <td>

                <button
                class="btn btn-success btn-sm"
                onclick="copyPassword('${item.password}')">

                <i class="bi bi-copy"></i>

                </button>

                <button
                class="btn btn-danger btn-sm"
                onclick="deletePassword(${item.id})">

                <i class="bi bi-trash"></i>

                </button>

            </td>

            </tr>

            `;

        });

    } catch (error) {

        console.log(error);

    }

}

loadPasswords();


// SAVE PASSWORD

async function savePassword() {

    const app_name =
        document.getElementById(
            "app_name"
        ).value;

    const username =
        document.getElementById(
            "username"
        ).value;

    const password =
        document.getElementById(
            "password"
        ).value;

    if (
        !app_name ||
        !username ||
        !password
    ) {

        alert(
            "Please fill all fields"
        );

        return;

    }

    try {

        const response =
            await fetch(
                `${API_URL}/passwords`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        app_name,
                        username,
                        password
                    })
                }
            );

        const data =
            await response.json();

        alert(
            data.message
        );

        loadPasswords();

        document.getElementById(
            "app_name"
        ).value = "";

        document.getElementById(
            "username"
        ).value = "";

        document.getElementById(
            "password"
        ).value = "";

    } catch (error) {

        alert(
            "Error saving password"
        );

    }

}


// DELETE PASSWORD

async function deletePassword(id) {

    if (
        !confirm(
            "Delete Password?"
        )
    ) {
        return;
    }

    try {

        await fetch(
            `${API_URL}/passwords/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        loadPasswords();

    } catch (error) {

        console.log(error);

    }

}


// COPY PASSWORD

function copyPassword(password) {

    navigator.clipboard.writeText(
        password
    );

    alert(
        "Password Copied"
    );

}


// SHOW/HIDE PASSWORD

function togglePassword(button){

    const input =
    button.parentElement.querySelector(
        ".password-field"
    );

    const icon =
    button.querySelector("i");

    if(input.type === "password"){

        input.type = "text";

        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");

    }else{

        input.type = "password";

        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    }
}


// SEARCH

function filterPasswords() {

    const search =
        document
            .getElementById(
                "search"
            )
            .value
            .toLowerCase();

    const rows =
        document.querySelectorAll(
            "#passwordTable tr"
        );

    rows.forEach(row => {

        const app =
            row.children[0]
                .innerText
                .toLowerCase();

        row.style.display =
            app.includes(search)
                ? ""
                : "none";

    });

}


// LOGOUT

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );

    window.location.href =
        "login.html";

}