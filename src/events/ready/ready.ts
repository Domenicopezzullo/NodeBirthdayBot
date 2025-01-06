import type { Client } from 'discord.js';
import { check_birthdays } from '../..';

export default (client: Client<true>) => {
  console.log(`${client.user.tag} is online!`);
  check_birthdays()
  setInterval(check_birthdays, 360000);
};
