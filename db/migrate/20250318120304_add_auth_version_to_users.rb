class AddAuthVersionToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :auth_version, :integer
  end
end
