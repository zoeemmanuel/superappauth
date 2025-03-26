class User < ApplicationRecord
  validates :handle, presence: true, uniqueness: true,
    format: { with: /\A@[a-zA-Z0-9_]+\z/, message: "must start with @ and contain only letters, numbers, and underscores" }
  validates :phone, presence: true, uniqueness: true,
    format: { with: /\A\+44\d{10}\z|\A\+65\d{8}\z/, message: "must be in +44 (11 digits) or +65 (9 digits) format" }
  validates :guid, presence: true, uniqueness: true

  before_create :ensure_webauthn_id

  def self.mask_phone(phone)
    return nil unless phone
    "*******#{phone.last(4)}"
  end
  
  # Add these methods for PIN functionality
  def pin_set?
    pin_hash.present?
  end

  def pin_recently_set?
    pin_set_at.present? && pin_set_at > 30.days.ago
  end
  
  private

  def ensure_webauthn_id
    # If GUID exists, use that as WebAuthn ID
    self.webauthn_id = self.guid
  end
end
