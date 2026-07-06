const mongoose = require('mongoose');
const { getLifecycleStatus, normalizeContractType } = require('../services/contractLifecycle');

const contractSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    type: {
      type: String,
      required: [true, 'Contract type is required'],
      enum: ['renewable', 'active_to_terminer', 'cdi'],
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'en_attente', 'terminer'],
      default: 'active',
    },
    dateDebut: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    dateFin: {
      type: Date,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
      default: 0,
    },
    documentUrl: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'userId is required'],
      ref: 'User',
    },
    fournisseurId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'fournisseurId is required'],
      ref: 'Fournisseur',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

contractSchema.index({ status: 1, type: 1, dateFin: 1 });

contractSchema.pre('validate', function validateContract(next) {
  this.type = normalizeContractType(this.type);

  if (this.type === 'cdi') {
    this.dateFin = null;
  } else if (!this.dateFin) {
    this.invalidate('dateFin', 'End date is required');
  }

  if (this.dateDebut && this.dateFin && this.dateFin < this.dateDebut) {
    this.invalidate('dateFin', 'End date must be after the start date');
  }

  this.status = getLifecycleStatus(this);

  next();
});

contractSchema.statics.findNearExpiry = function findNearExpiry(daysThreshold = 30) {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return this.find({
    type: 'renewable',
    status: 'active',
    dateFin: { $lte: thresholdDate },
  });
};

module.exports = mongoose.model('Contract', contractSchema);
