-- This file contains the seeders for the application

    --Function to clear the DB
        CREATE OR REPLACE FUNCTION clear_database()
        RETURNS void
        LANGUAGE plpgsql
        AS $$
        BEGIN
            DELETE FROM public.users;
            DELETE FROM public.categories;
            DELETE FROM public.locations;
        END;
        $$;

    -- Seed data for users table

        -- Unique user ID generator
            CREATE OR REPLACE FUNCTION  gen_unique_userid()
            RETURNS integer
            LANGUAGE plpgsql
            AS $$
            DECLARE
                   curr_val integer;
            BEGIN
                -- Select the maximum ID from the 'users' table, or 0 if no rows exist
                SELECT COALESCE(MAX(id), 0) +1 INTO curr_val FROM public.users;

                -- Return the incremented maximum ID as the next unique integer
                RETURN curr_val;
            END;
            $$;

        -- Function to populate the users table
            CREATE OR REPLACE FUNCTION populate_users()
            RETURNS void
            LANGUAGE plpgsql
            AS $$
            DECLARE
                i integer :=1;
                first_names TEXT[] := ARRAY['Saif', 'Nick', 'Lara', 'Gali', 'Gulce', 'Mohjhan', 'Rei', 'Fais', 'Dillon', 'Jaewon', 'Victor', 'Tiffany', 'Noah', 'Mira', 'Minos', 'Mika', 'Mack', 'Lina', 'Leticia', 'Leo', 'Karan', 'Jaewon'];
                last_names  TEXT[] := ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Mendoza', 'Carlson', 'Prassna', 'Courtez'];
            BEGIN
                WHILE i<= 100 LOOP
                INSERT INTO public.users (id, first_name, last_name, role, created_at, updated_at)
                VALUES (
                      gen_unique_userid(),
                      first_names[(random() * array_length(first_names, 1) + 1)::int],
                      last_names[(random() * array_length(last_names, 1) + 1)::int],
                      CASE WHEN i=1 THEN 'Admin' ELSE 'Volunteer' END,
                      NOW(),
                      NOW()
                    );
                    i := i+1;
                END LOOP;
            END;
            $$;

        -- Function to Delete a User by userId
            CREATE OR REPLACE FUNCTION delete_user_by_id(user_uuid uuid)
            RETURNS void
            LANGUAGE plpgsql
            AS $$
            BEGIN
                DELETE FROM public.users WHERE id= user_uuid;
            END;
            $$

--Function call that will setup the database:
    --SELECT clear_database()
    SELECT populate_users();