 $(function(){
        //csmapi.set_endpoint ('https://6.iottalk.tw');
        var profile = {
		    'dm_name': 'Dummy_Device',          
			'odf_list':[Dummy_Control],
		    'd_name': 'testOutput',
        };

        var old_throw_count = -1;
        var new_throw_count = 0;

        /*************************************
         * Case 1: Stop  - [-1, throw_count]
         * Case 2: Pause - [-2, throw_count]
         * Case 3: Throw - [x, y, throw_count]
         */
        function Dummy_Control(data){
            new_throw_count = data[0][2]
            if (new_throw_count > old_throw_count) {
                if (data[0][0] == -1)           // -1: start new game
                    oGame.keyDown(78, 0, 0);    
                else if (data[0][0] == -2)      // -2: pause the game
                    oGame.keyDown(83, 0, 0);
                else
                    oGame.keyDown(32, data[0][0], data[0][1]);

                old_throw_count = new_throw_count;
            }
        }
      
/*******************************************************************/                
        function ida_init(){
	        console.log(profile.d_name);
	    }
        var ida = {
            'ida_init': ida_init,
        }; 
        dai(profile,ida);     
});
