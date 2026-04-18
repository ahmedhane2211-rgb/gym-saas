import express from 'express';
import { createMember, deleteMember, getAllMembers, getMemberById, updateMember } from '../controllers/memberController.js';
import { authUser } from '../middlewares/authUser.js';

export const memberRouter = express.Router();

// Define your member routes here
memberRouter.get('/', authUser,getAllMembers);

memberRouter.get('/:id', authUser,getMemberById);

memberRouter.post('/', authUser,createMember);

memberRouter.put('/:id', authUser,updateMember);

memberRouter.delete('/:id', authUser,deleteMember);