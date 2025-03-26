class AddSessionsValidAfterToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :sessions_valid_after, :datetime
  end
end
