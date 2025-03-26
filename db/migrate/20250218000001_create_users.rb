class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :handle, null: false
      t.string :phone, null: false
      t.string :guid, null: false
      
      t.index :handle, unique: true
      t.index :phone, unique: true
      t.index :guid, unique: true

      t.timestamps
    end
  end
end
