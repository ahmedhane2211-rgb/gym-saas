import express from 'express';
import { createMember, deleteMember, getAllMembers, getMemberById, updateMember } from '../controllers/memberController.js';
import { authUser } from '../middlewares/authUser.js';
import authorize from '../middlewares/authorize.js';
export const memberRouter = express.Router();

memberRouter.get('/', authorize(["admin", "reception"]), getAllMembers);

memberRouter.get('/:id', authorize(["admin", "reception"]), getMemberById);

memberRouter.post('/', authorize(["admin", "reception"]), createMember);

memberRouter.put('/:id', authorize(["admin", "reception"]), updateMember);

memberRouter.delete('/:id', authorize(["admin"]), deleteMember);