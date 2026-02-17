import mongoose from "mongoose";

const DomainSchema = new mongoose.Schema({
  domain_name: {
    type: String,
    required: true,
    unique: true
  },
  color: {
    type: String,
    default: "#3498db"
  }
});

export default mongoose.model("Domain", DomainSchema);
