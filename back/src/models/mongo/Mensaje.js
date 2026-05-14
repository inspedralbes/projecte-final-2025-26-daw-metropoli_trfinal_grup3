import mongoose from "mongoose";

const MensajeSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: Number,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    receiverId: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Mensaje = mongoose.model("Mensaje", MensajeSchema);

export default Mensaje;
