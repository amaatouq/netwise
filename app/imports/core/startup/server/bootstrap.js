const admins = [
  {
    username: "admin",
    password: "victoria newish cymbal easter"
  }
];

Meteor.startup(() => {
  admins.forEach(admin => {
    const exists = Meteor.users.findOne(_.omit(admin, "password"));
    if (!exists) {
      Accounts.createUser(admin);
    }
  });
});
