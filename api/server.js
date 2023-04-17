// SUNUCUYU BU DOSYAYA KURUN

const express = require("express");

const server = express();
server.use(express.json());

const UserModel = require("./users/model");

const createUserHandler = async (req, res) => {
  try {
    const user = req.body;
    if (!user.bio || !user.name) {
      return res
        .status(400)
        .json({ message: "Lütfen kullanıcı için bir name ve bio sağlayın" });
    }
    const newUser = await UserModel.insert(user);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
  }
};

const getUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
  }
};

const getOneUser = async (req, res) => {
  try {
    const idUsers = await UserModel.findById(req.params.id);
    if (!idUsers) {
      res
        .status(404)
        .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
    } else {
      res.status(200).json(idUsers);
    }
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
    }
    await UserModel.remove(id);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (user) {
      const name = req.body.name;
      const bio = req.body.bio;
      if (name && bio) {
        const newupdate = await UserModel.update(id, { name: name, bio: bio });
        res.status(200).json(newupdate);
      } else {
        res
          .status(400)
          .json({ message: "Lütfen kullanıcı için name ve bio sağlayın" });
      }
    } else {
      res
        .status(404)
        .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
    }
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
  }
};
//! post metodu
server.post("/api/users", createUserHandler);
//! get metodları
server.get("/api/users", getUsers);
server.get("/api/users/:id", getOneUser);
//! delete metodu
server.delete("/api/users/:id", deleteUser);
//! put(edit) metodu
server.put("/api/users/:id", updateUser);

module.exports = server; // SERVERINIZI EXPORT EDİN {}
