import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function readLineAsync(promptText = "") {
  return new Promise((resolve) => {
    rl.question(promptText, (answer) => {
      resolve(answer);
    });
  });
}

function clear() {
  console.clear();
}

let money = 0;
let healthScore = 5;
let ratings = 50;
let possibleList = ["Liam", "Olivia", "Noah", "Emma", "Oliver", "Amelia", "Theodore", "Charlotte", "James", "Mia"];
let peopleList = [];
let day = 1;
let inventory = 0;
let beerLevel = 0;
let goonCount = 0;
let beerLevelCost = 20;
let goonCountCost = 25;
let deadPeople = 0;

class Person {
  constructor(name, age, bmi, alive = true) {
    this.name = name;
    this.age = age;
    this.bmi = bmi;
    this.alive = alive;
  }
  die() {
    this.alive = false;
  }
}

function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function deployGoons() {
  let corpses = peopleList.filter(p => !p.alive);
  let canRemove = Math.min(goonCount, corpses.length);
  let removed = 0;
  for (let i = 0; i < peopleList.length && removed < canRemove; i++) {
    if (!peopleList[i].alive) {
      peopleList.splice(i, 1);
      removed++;
      i--;
      console.log("A goon removed one corpse.");
    }
  }
  if (canRemove < corpses.length) {
    console.log("Not enough goons to remove all corpses!");
  }
}

peopleList.push(new Person("Noah", getRandomInteger(21, 60), getRandomInteger(18, 30)));

async function playerAction() {
  while (true) {
    console.log("BAR");
    console.log("_______________");
    for (let i = 0; i < 5; i++) {
      if (peopleList[i]) {
        console.log(peopleList[i].alive ? "|      | p    |" : "|      | d    |");
      } else {
        console.log("|      | e    |");
      }
    }
    console.log("|______|______|");
    console.log("\n--- DAY " + day + " ---");
    console.log("Money: $" + money);
    console.log("Inventory: " + inventory);
    console.log("Ratings: " + ratings + "%");
    console.log("People in bar (" + peopleList.length + "):");
    for (let i = 0; i < peopleList.length; i++) {
      let tag = peopleList[i].alive ? "" : " (DEAD)";
      console.log(peopleList[i].name + tag);
    }
    console.log("\nBeer level: " + beerLevel);
    console.log("Goon count: " + goonCount);

    let action = parseInt(await readLineAsync(
      "\nWhat action do you want to take?\n" +
      "Serve Customer(1)\nStats(2)\nOpen Store(3)\nDeploy Goons(4)\nKick Person Out(5)\nNext Day(6)\nHelp(7)\n> "
    ));

    if (action === 1) {
      if (inventory > 0) {
        let serveable = peopleList.filter(p => p.alive);
        if (serveable.length > 0) {
          let randomIndex = getRandomInteger(0, serveable.length - 1);
          let chosenDude = serveable[randomIndex];
          let gainedBmi = (10 - (10 * (beerLevel * 0.1)));
          chosenDude.bmi += gainedBmi;
          money += 10;
          console.log(chosenDude.name + "'s BMI increased by " + gainedBmi.toFixed(2) + ". Current BMI: " + chosenDude.bmi.toFixed(2));
          inventory--;
          ratings += 7;
        } else {
          console.log("No customers to serve right now!");
        }
      } else {
        console.log("No inventory!");
      }
    } else if (action === 2) {
      clear();
      for (let p of peopleList) {
        console.log("\nName: " + p.name);
        console.log("BMI: " + p.bmi);
        console.log("Age: " + p.age);
        console.log("Alive: " + p.alive);
      }
    } else if (action === 3) {
      clear();
      console.log("\nBEER: Beer level is " + beerLevel + ", upgrade cost: $" + beerLevelCost + " (1)");
      console.log("GOON COUNT: " + goonCount + ", upgrade cost $" + goonCountCost + " (2)");
      let purchase = parseInt(await readLineAsync("Enter number for purchase: "));
      if (purchase === 1) {
        if (money < beerLevelCost) {
          console.log("You don't have the funds.");
        } else {
          console.log("You purchased BEER LEVEL");
          beerLevel++;
          money -= beerLevelCost;
          beerLevelCost = Math.floor(beerLevelCost * 1.5);
        }
      } else if (purchase === 2) {
        if (money < goonCountCost) {
          console.log("You don't have the funds.");
        } else {
          console.log("You purchased an extra goon.");
          goonCount++;
          money -= goonCountCost;
          goonCountCost = Math.floor(goonCountCost * 1.5);
        }
      }
    } else if (action === 4) {
      deployGoons();
    } else if (action === 5) {
      let kick = parseInt(await readLineAsync("Enter index of person you want gone: "));
      if (!isNaN(kick) && kick >= 0 && kick < peopleList.length) {
        peopleList.splice(kick, 1);
        console.log("Person removed from the bar.");
      } else {
        console.log("Invalid index.");
      }
    } else if (action === 6) {
      day++;
      clear();
      return;
    } else if (action === 7) {
      clear();
      console.log("Bar Simulator: How to Play\n\nWelcome to Bar Simulator! Manage inventory, serve customers, upgrade beer/goons, and survive day by day. Keep ratings up, or you lose!");
    }

    for (let person of peopleList) {
      if (person.alive && person.bmi > 50) {
        person.die();
        deadPeople++;
        ratings = Math.max(0, ratings - 25);
        console.log(person.name + " has died from high BMI!");
      }
    }

    await readLineAsync("\nPress Enter to return to actions...");  //im bored writing comments
    clear();
  }
}

async function main() {
  await readLineAsync("Welcome to Bar Simulator!\nEnter anything to start!");
  clear();
  while (true) {
    inventory += 3;
    let personChance = getRandomInteger(1, 100);
    if (personChance < ratings && peopleList.length < 5) {
      let customerName = possibleList[getRandomInteger(0, possibleList.length - 1)];
      peopleList.push(new Person(customerName, getRandomInteger(21, 60), getRandomInteger(18, 30)));
    }
    await playerAction();
    if (ratings <= 0) {
      clear();
      console.log("You lose!");
      rl.close();
      break;
    }
  }
}

main();