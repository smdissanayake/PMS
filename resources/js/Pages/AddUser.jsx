import React, { useState } from "react";
import { router } from '@inertiajs/react';

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    router.post('/users', { name, email, password }, {
      onSuccess: () => {
        alert("User added successfully!");
      },
      onError: (errors) => {
        alert("Error occurred");
        console.log(errors);
      }
    });
  };

  return (
    <div>
      <h1>Add New User</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}
