const net = require("net");
const chalk = require("chalk");
const randomColor = require("randomcolor");
const send_request = require("../Database/send_request");
const remove_user = require("../Database/online_remove");
const list_requests = require("../Database/list_request");
const remove_request = require("../Database/remove_request");
const sockets = [];
const one_to_one = [];
const group = [];
let colors = new Set();
let count_color = 1;
function random_color() {
  while (colors.size < 256) {
    const color = randomColor({
      luminosity: "bright",
      format: "hex",
    });
    if (color !== "#000000") {
      colors.add(color);
    }
  }
  colors = Array.from(colors);
}
random_color();
async function user_offline(username_login) {
  await remove_user.remove_user(username_login);
}
function message_multiple(socket, message) {
  let i = 0;
  for (i = 0; i < group.length; i++) {
    if (
      group[i].admin_name.localeCompare(socket.id) == 0 ||
      group[i].users.indexOf(socket.id) != -1
    )
      break;
  }

  for (let j = 0; j < group[i].users_socket.length; j++) {
    if (group[i].users_socket[j] != socket)
      group[i].users_socket[j].write(
        socket.color(socket.myhexcolor, socket.id) + ": " + message
      );
  }
}

function notifyall(socket, message) {
  let i = 0;
  for (i = 0; i < group.length; i++) {
    if (
      group[i].admin_name.localeCompare(socket.id) == 0 ||
      group[i].users.indexOf(socket.id) != -1
    )
      break;
  }

  for (let j = 0; j < group[i].users_socket.length; j++) {
    if (group[i].users_socket[j] != socket)
      group[i].users_socket[j].write(
        chalk.greenBright("Server") + ": " + message
      );
  }
}
function add_group(admin_name, admin_socket, name, password) {
  admin_socket.in_group = true;
  admin_socket.color = group_color;
  admin_socket.myhexcolor = colors[0];
  let obj = {
    admin_name: admin_name,
    admin_socket: admin_socket,
    name: name,
    password: password,
    users: [],
    users_socket: [admin_socket],
  };
  group.push(obj);
}
function is_exists(name) {
  for (let i = 0; i < group.length; i++) {
    if (group[i].users.indexOf(name) != -1) {
      return true;
    }
  }
  return false;
}
function showgroups() {
  let answer = [];
  for (let i = 0; i < group.length; i++) {
    answer.push(i + 1 + ". " + group[i].name);
  }
  return answer;
}
function remove_number(data) {
  let answer = [];
  for (let i = 0; i < data.length; i++) {
    answer.push(data[i].split(".")[1].trimStart());
  }
  return answer;
}
function group_info(name) {
  let answer = [];
  //check group exists
  let count = 2;
  let i;
  for (i = 0; i < group.length; i++) {
    //console.log(group[i].name + "." + name + ".");
    if (group[i].name.localeCompare(name) == 0) {
      break;
    }
  }
  answer.push("1. " + group[i].admin_name + " " + chalk.red("(Admin)"));
  // console.log(i);
  // console.log(JSON.stringify(group[i].users));
  for (let j = 0; j < group[i].users.length; j++) {
    answer.push(count + ". " + group[i].users[j]);
    count++;
  }
  return answer;
}
function check_password(name, password) {
  let i;
  for (i = 0; i < group.length; i++) if (group[i].name == name) break;
  if (group[i].password.localeCompare(password) == 0) return true;
  return false;
}
function add_user_in_group(name, username, user_socket) {
  let i;
  for (i = 0; i < group.length; i++) {
    if (group[i].name.localeCompare(name) == 0) {
      user_socket.in_group = true;
      user_socket.color = group_color;
      user_socket.myhexcolor = colors[count_color];
      count_color++;
      group[i].users.push(username);
      group[i].users_socket.push(user_socket);
      break;
    }
  }
}
function remove_user_from_group(group_name, user_socket) {
  let i;
  for (i = 0; i < group.length; i++) {
    if (group.name.localeCompare(group_name) == 0) {
      let index = group[i].users.indexOf(user_socket.id);
      let index2 = group[i].users_socket.indexOf(user_socket);
      group[i].users.splice(index, 1);
      group[i].users_socket.splice(index2, 1);
      user_socket.in_group = false;
      delete user_socket.color;
      delete user_socket.myhexcolor;
      break;
    }
  }
}
function is_user_in_other_group(username) {
  username = username.split("-")[0];
  // console.log(username);
  for (let i = 0; i < group.length; i++) {
    if (group[i].admin_name.search(username) != -1) return false;

    for (let j = 0; j < group[i].users.length; j++) {
      if (group[i].users[j].search(username) != -1) {
        return false;
      }
    }
  }
  return true;
}
function getid(name) {
  let count = 0;
  for (let i = 0; i < sockets.length; i++) {
    let dummy = sockets[i][0].split("-");
    if (dummy[0].localeCompare(name) == 0) {
      count = parseInt(dummy[1]);
    }
  }
  count += 1;
  return name + "-" + count;
}
function getsocket(name) {
  let count = 0;
  for (let i = 0; i < sockets.length; i++) {
    //  console.log(sockets[i][0], name);

    if (sockets[i][0].localeCompare(name) == 0) {
      return sockets[i][1];
    }
  }
  return -1;
}
const server = net.createServer((socket) => {
  socket.on("data", async (data) => {
    data = JSON.parse(data);
    if (data.type.toLowerCase().localeCompare("login") == 0) {
      let dummy = data.data.split(" ");
      socket.in_one_to_one = false;
      socket.in_group = false;
      const id = getid(dummy[0]);
      console.log(chalk.green(dummy[0]) + " Connected to the server");
      socket.id = id;
      sockets.push([id, socket]);
      //console.log(sockets);
    }
    if (data.type.toLowerCase().localeCompare("-clients") == 0) {
      let count = 1;
      if (sockets.length > 1) {
        socket.write(
          chalk.greenBright("Server:") +
            " The List of Clients who are online are:\n"
        );
        for (let i = 0; i < sockets.length; i++) {
          if (sockets[i][1].id.localeCompare(socket.id) != 0) {
            socket.write(" " + count + ". " + sockets[i][1].id + "\n");
            count += 1;
          }
        }
      } else {
        socket.write("No Clients in Online " + "😞");
      }
    }
    if (data.type.toLowerCase().localeCompare("request") == 0) {
      let dummy = getsocket(data.request_to);
      //  console.log(dummy);
      //   console.log(data);
      if (
        dummy != -1 &&
        dummy.in_one_to_one == false &&
        dummy.in_group == false
      ) {
        socket.write(
          chalk.greenBright("Request Sent Successfully to :") +
            chalk.yellowBright(data.request_to)
        );
        dummy.write(
          chalk.yellowBright("Server:") +
            " " +
            chalk.greenBright(socket.id) +
            " has Sent a Request to You"
        );
        await send_request.add_request(socket.id, data.request_to);
      } else {
        socket.write(
          chalk.redBright(
            "User is not in Online or Not Exits or in Another Chat"
          )
        );
      }
    }
    if (data.type.toLowerCase().localeCompare("list_requests") == 0) {
      const requests = await list_requests.list_client_requested(socket.id);

      if (requests.length > 0) {
        socket.write(
          chalk.greenBright("Server:") + " List of Requested Clients: \n"
        );
        for (let i = 0; i < requests.length; i++) {
          socket.write(i + 1 + ". " + requests[i]);
        }
      } else {
        socket.write(
          chalk.greenBright("Server :") + " No Requests From Clients"
        );
      }
    }
    if (data.type.toLowerCase().localeCompare("request_accept") == 0) {
      let result = await remove_request.remove_request(socket.id, data.user);
      let dummy = getsocket(data.user);
      if (
        result == true &&
        dummy != -1 &&
        dummy.in_one_to_one == false &&
        dummy.in_group == false
      ) {
        dummy.in_one_to_one = true;
        socket.in_one_to_one = true;
        dummy.color = yellow;
        socket.color = green;
        socket.write("$request_accepted");
        dummy.write("$request_accepted");
        one_to_one.push([socket, dummy]);
        console.log(one_to_one.toString());
      } else {
        if (dummy == -1) {
          socket.write(chalk.redBright("User is not in Online or Not Exits"));
        } else if (result == false) {
          socket.write(chalk.redBright("User has not send request to you"));
        } else {
          socket.write(chalk.redBright("User is in Another Chat"));
        }
      }
    }
    if (data.type.toLowerCase().localeCompare("exit-chat") == 0) {
      remove_alternate(socket);
    }
    if (data.type.toLowerCase().localeCompare("message") == 0) {
      if (data.chat.toLowerCase().localeCompare("1-1") == 0) {
        sent_to_alternate(socket, data.message);
      } else {
        message_multiple(socket, data.message);
      }
    }

    if (data.type.toLowerCase().localeCompare("end") == 0) {
      console.log(data.data);
      await user_offline(socket.id);
      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i][1].id.localeCompare(socket.id) == 0) {
          sockets.splice(i, 1);
          break;
        }
      }
      console.log("No of user conected to the Server" + sockets.length);
    }

    if (data.type.toLowerCase().localeCompare("create_group") == 0) {
      let data1 = remove_number(showgroups());
      if (data1.length == 0 || data1.indexOf(data.group_name) == -1) {
        if (is_user_in_other_group(socket.id) != false) {
          add_group(socket.id, socket, data.group_name, data.group_password);
          socket.write("$Group Created Successfully");
        } else {
          socket.write(chalk.redBright("User is allowed only in one group"));
        }
      } else {
        socket.write(
          chalk.redBright("Already same Named group exists! Use another name")
        );
      }
    }
    if (data.type.toLowerCase().localeCompare("list_groups") == 0) {
      let data = showgroups();
      if (data.length > 0) {
        socket.write("The List Of Active Groups are: \n");
        socket.write(data.join("\n"));
      } else socket.write(chalk.redBright("No groups created yet"));
    }
    if (data.type.toLowerCase().localeCompare("group_info") == 0) {
      let data1 = remove_number(showgroups());
      if (data1.indexOf(data.name) != -1) {
        let result = group_info(data.name);
        socket.write("The List of Active Users In Group are: \n");
        socket.write(result.join("\n"));
      } else {
        socket.write(chalk.redBright("No Group exists With such name"));
      }
    }

    if (data.type.toLowerCase().localeCompare("join_group") == 0) {
      let data1 = remove_number(showgroups());
      if (data1.indexOf(data.group_name) != -1) {
        if (check_password(data.group_name, data.group_password)) {
          if (is_user_in_other_group(socket.id) != false) {
            add_user_in_group(data.group_name, socket.id, socket);
            socket.write("$Added in to Group successfully");
            notifyall(socket, socket.id.split("-")[0] + " Joined the Group");
          } else {
            socket.write(chalk.redBright("User is allowed only in one group"));
          }
        } else socket.write(chalk.redBright("Wrong Password"));
      } else {
        socket.write(chalk.redBright("No Group exists With such name"));
      }
    }
  });
  socket.on("error", (err) => {});
});
function remove_alternate(socket) {
  let i;
  for (i = 0; i < one_to_one.length; i++) {
    if (socket == one_to_one[i][0] || socket == one_to_one[i][1]) {
      socket.in_one_to_one = false;
      if (socket.hasOwnProperty("color")) {
        delete socket.color;
      }
      if (socket == one_to_one[i][0]) {
        one_to_one[i][1].write("$Other Client has disconnected");
        one_to_one[i][1].in_one_to_one = false;
        if (one_to_one[i][1].hasOwnProperty("color")) {
          delete one_to_one[i][1].color;
        }
      } else {
        one_to_one[i][0].write("$Other Client has disconnected");
        one_to_one[i][0].in_one_to_one = false;
        if (one_to_one[i][0].hasOwnProperty("color")) {
          delete one_to_one[i][0].color;
        }
      }
      break;
    }
  }
  if (i != one_to_one.length) {
    one_to_one.splice(i, 1);
  }
  console.log("No of Chats" + one_to_one.length);
}
function sent_to_alternate(socket, message) {
  for (let i = 0; i < one_to_one.length; i++) {
    if (socket == one_to_one[i][0] || socket == one_to_one[i][1]) {
      if (socket == one_to_one[i][0]) {
        one_to_one[i][1].write(
          one_to_one[i][0].color(one_to_one[i][0].id).split("-")[0] +
            ": " +
            message
        );
      } else {
        one_to_one[i][0].write(
          one_to_one[i][1].color(one_to_one[i][1].id).split("-")[0] +
            ": " +
            message
        );
      }
      break;
    }
  }
}
function yellow(string) {
  return chalk.yellowBright(string);
}
function green(string) {
  return chalk.greenBright(string);
}
function group_color(hexvalue, message) {
  return chalk.hex(hexvalue)(message);
}
server.listen(12345);
