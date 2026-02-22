import express from 'express';
import { createMember, deleteMember, getAllMembers, getMemberById, updateMember } from '../controllers/memberController.js';

export const memberRouter = express.Router();

// Define your member routes here
memberRouter.get('/', getAllMembers);

memberRouter.get('/:id', getMemberById);

memberRouter.post('/', createMember);

memberRouter.put('/:id', updateMember);

memberRouter.delete('/:id', deleteMember);