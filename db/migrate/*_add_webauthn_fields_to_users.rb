class AddWebAuthnFieldsToUsers < ActiveRecord::Migration[6.1]  # Your Rails version might be different
  def change
    add_column :users, :webauthn_id, :string, null: true
    add_index :users, :webauthn_id, unique: true
  end
end
