import fs from "fs/promises";
import axios from "axios";

async function main() {
  const response = await axios.get("https://dummyjson.com/users");
  const users = response.data.users;
  const extractedData = users.map((user) => {
    return {
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      birthDate: user.birthDate,
      country: user.address?.country,
    };
  });
  await fs.writeFile("users.json", JSON.stringify(extractedData));
}

main();
