class AddPinHashToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :pin_hash, :string
    add_column :users, :pin_set_at, :datetime
  end
end
