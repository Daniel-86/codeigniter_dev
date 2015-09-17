<?php if( !defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Created by IntelliJ IDEA.
 * User: daniel
 * Date: 15/09/15
 * Time: 01:29 AM
 */
class satisfaction_poll extends CI_Controller {
    function loadForm() {
        $this->load->view('satisfaction_poll/index.html');
    }
}