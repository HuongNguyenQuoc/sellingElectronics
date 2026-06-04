import mongoose, { Model,Schema } from 'mongoose';

export enum Type {
    COMPUTER = 'computer',
    PHONE = 'phone',
    ACCESSORY = 'accessory',
    HARDWARE = 'hardware',
    SOFTWARE = 'software',
    OTHER = 'other'
}