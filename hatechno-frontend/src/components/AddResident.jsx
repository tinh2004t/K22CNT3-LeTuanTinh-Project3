import { useState } from "react";
import { addResident } from "../services/residentService";

const AddResident = ({ onResidentAdded }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    await addResident({ name });
    setName("");
    onResidentAdded();
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Thêm cư dân mới</h2>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          className="border p-2"
          placeholder="Nhập tên cư dân"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Thêm
        </button>
      </form>
    </div>
  );
};

export default AddResident;
