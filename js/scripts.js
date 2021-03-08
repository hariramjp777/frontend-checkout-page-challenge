document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("input").forEach(function (input) {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focusing");
    });
    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focusing");
    });
  });
  document.querySelector("select").addEventListener("focus", function () {
    this.parentElement.classList.add("focusing");
  });
  document.querySelector("select").addEventListener("blur", function () {
    this.parentElement.classList.remove("focusing");
  });
  document.querySelectorAll(".add").forEach(function (add) {
    add.addEventListener("click", function () {
      const input = this.previousElementSibling;
      input.focus();
      const newValue = parseInt(input.value) + 1;
      if (newValue <= 20) {
        input.value = newValue;
      }
    });
  });
  document.querySelectorAll(".remove").forEach(function (remove) {
    remove.addEventListener("click", function () {
      const input = this.nextElementSibling;
      input.focus();
      const newValue = parseInt(input.value) - 1;
      if (newValue >= 0) {
        input.value = newValue;
      }
    });
  });
  document.querySelectorAll(".quantity button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const noOfBags = parseInt(document.getElementById("bags").value);
      const noOfShoes = parseInt(document.getElementById("shoes").value);
      let ship = 0;
      if (noOfBags || noOfShoes) {
        ship = 19;
      }
      document.getElementById("ship").textContent = ship;
      document.getElementById("total").textContent = `$${(
        noOfBags * 54.99 +
        noOfShoes * 74.99 +
        ship
      ).toFixed(2)}`;
    });
  });
  document.querySelectorAll("input[type=number]").forEach(function (input) {
    input.addEventListener("keydown", function (e) {
      e.preventDefault();
    });
  });
  document.getElementById("phone").addEventListener("keydown", function (e) {
    const allowed = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "a",
      "Backspace",
      "Tab",
    ];
    if (allowed.indexOf(e.key) === -1) {
      e.preventDefault();
    }
    if (e.key === "a" && !e.ctrlKey) {
      e.preventDefault();
    }
  });
  document.querySelector(".modal").addEventListener("click", function (e) {
    if (e.target.className == "modal view") {
      this.classList.remove("view");
      document.querySelector("form").reset();
    }
  });
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const name = document.getElementById("name");
    const address = document.getElementById("address");
    const country = document.getElementById("country");
    const code = document.getElementById("code");
    const bags = document.getElementById("bags");
    const shoes = document.getElementById("shoes");
    const city = document.getElementById("city");

    validation([email, phone, name, address, city, country, code, bags, shoes])
      .then((data) => document.querySelector(".modal").classList.add("view"))
      .catch((err) => {
        const elem = document.querySelector(`[name = ${err.name}]`);
        elem.focus();
        const span = document.createElement("span");
        span.classList.add("invalid");
        span.textContent = err.error;
        span.addEventListener("animationend", function () {
          setTimeout(() => span.remove(), 10);
        });
        elem.parentElement.parentElement.appendChild(span);
      });
  });
});

function validation(fields) {
  const validate = (field) => {
    const type = field.dataset.type;
    const name = field.name;
    const value = field.value;
    const valid = field.validity && field.validity.valid;
    const res = { name, error: null };
    if (
      type === "email" ||
      type === "code" ||
      type === "text" ||
      type === "phone"
    ) {
      if (!value.trim()) {
        return { ...res, error: "Please fill this field" };
      } else {
        if (type === "email")
          return valid
            ? res
            : { ...res, error: "Looks like this is not an email" };
        else if (type === "code")
          return value.length >= 5
            ? res
            : { ...res, error: "Code should be atleast 5 characters" };
        else if (type === "phone")
          return value.length === 10
            ? res
            : { ...res, error: "Looks like this is not a valid phone number" };
        else return res;
      }
    } else if (type === "quan") {
      return parseInt(value) > 0 ? res : { ...res, error: "*" };
    } else if (type === "country") {
      return value != "0" ? res : { ...res, error: "Please choose country" };
    } else {
      return null;
    }
  };
  return new Promise((resolve, reject) => {
    for (let field of fields) {
      const res = validate(field);
      if (res.error) {
        return reject(res);
      }
    }
    resolve(true);
  });
}
