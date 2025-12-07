import { Schema, model } from 'mongoose';

export interface ILink {
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClickedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const linkSchema = new Schema<ILink>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    targetUrl: {
      type: String,
      required: true,
      trim: true,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    lastClickedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Link = model<ILink>('Link', linkSchema);
export default Link;


