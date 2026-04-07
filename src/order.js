let currentState = welcoming;

let order = {
  burger: "",
  size: "",
  drink: ""
};

export function handleInput(sInput) {
  return currentState(sInput);
}

export function clearInput() {
  currentState = welcoming;
  order = {
    burger: "",
    size: "",
    drink: ""
  };
}

function welcoming() {
  let aReturn = [];
  currentState = choosingBurger;
  aReturn.push("Welcome to Burger Queen.");
  aReturn.push("Would you like a Hamburger Combo or a Double Cheeseburger Combo?");
  return aReturn;
}

function choosingBurger(sInput) {
  let aReturn = [];
  const input = sInput.toLowerCase();

  if (input.includes("double")) {
    order.burger = "Double Cheeseburger Combo";
    currentState = choosingSize;
    aReturn.push("You chose the Double Cheeseburger Combo.");
    aReturn.push("What size would you like: small, medium, or large?");
  } else if (input.includes("hamburger")) {
    order.burger = "Hamburger Combo";
    currentState = choosingSize;
    aReturn.push("You chose the Hamburger Combo.");
    aReturn.push("What size would you like: small, medium, or large?");
  } else {
    aReturn.push("Please choose Hamburger Combo or Double Cheeseburger Combo.");
  }

  return aReturn;
}

function choosingSize(sInput) {
  let aReturn = [];
  const input = sInput.toLowerCase();

  if (input.startsWith("s")) {
    order.size = "Small";
  } else if (input.startsWith("m")) {
    order.size = "Medium";
  } else if (input.startsWith("l")) {
    order.size = "Large";
  } else {
    aReturn.push("Please choose a valid size: small, medium, or large.");
    return aReturn;
  }

  currentState = choosingDrink;
  aReturn.push(`You chose a ${order.size} ${order.burger}.`);
  aReturn.push("What drink would you like: Coke, Sprite, or Mtn Dew?");
  return aReturn;
}

function choosingDrink(sInput) {
  let aReturn = [];
  const input = sInput.toLowerCase();

  if (input.includes("coke")) {
    order.drink = "Coke";
  } else if (input.includes("sprite")) {
    order.drink = "Sprite";
  } else if (input.includes("mtn dew")) {
    order.drink = "Mtn Dew";
  } else {
    aReturn.push("Please choose a valid drink: Coke, Sprite, or Mtn Dew.");
    return aReturn;
  }

  currentState = welcoming;
  aReturn.push(
    `Your order is confirmed: ${order.size} ${order.burger} with a ${order.drink}.`
  );
  aReturn.push("Thank you for ordering from Burger Queen!");
  return aReturn;
}
