import React, { useState } from "react";
import "./UploadForm.scss";

function UploadForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    prompt: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    alert("Your image has been submitted for review!");
  };

  return (
    <form className="uploadForm" onSubmit={handleSubmit}>
      <h2>Upload Your Image</h2>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="prompt"
        placeholder="Prompt used for this image"
        value={form.prompt}
        onChange={handleChange}
        required
      ></textarea>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default UploadForm;
