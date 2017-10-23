<?php
/**
 * This software is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * @copyright  Copyright (c) 2011 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 */

/**
 * Api Time
 *
 */
class Api_Helper_Time
{
    protected $options, $timecard;

    public function setOptions($options)
    {
	$this->options = $options;
    }

    public function setTimecard($id = null)
    {
	$this->timecard = new Timecard_Models_Timecard();
	if(isset($id)) {
		$this->timecard->find($id);
	}
    }

    public function getTimecard()
    {
	return $this->timecard;
    }

    public function registerTime()
    {

       	$table = new Project_Models_Project();
	$select = 'tt_task_id = ' . $this->options['task_id'];
	$row = $table->fetchAll($select);
	$task = $row[0];
    	
	$params = array('id' => 0,
			'startDatetime' => Cleaner::sanitize('datetime', $this->options['date'] 
									 . ' ' . 
									 $this->options['start']),
			'endTime' => Cleaner::sanitize('time', $this->options['finish']),
			'projectId' => $task->id,
			'notes' => Cleaner::sanitize('string', $this->options['notes']),
			'timecardId' => 0 );

        $params['minutes'] = Timecard_Models_Timecard::getDiffTime($params['endTime'],
        substr($params['startDatetime'], 11));

        Default_Helpers_Save::save($this->timecard, $params);

	if(!$task->realStartDate) {
		$node    = new Phprojekt_Tree_Node_Database($task, $task->id);
		$newNode = Default_Helpers_Save::save($task, array('realStartDate' => $params['startDatetime']));
	}

	if($this->options['real_finish']) {
		$real_end_date = Cleaner::sanitize('datetime', $this->options['date']. ' ' .$this->options['finish']);
		$node    = new Phprojekt_Tree_Node_Database($task, $task->id);
		$newNode = Default_Helpers_Save::save($task, array('realEndDate' => $real_end_date));
	}
    }

    public function deleteTime()
    {
	if(empty($this->timecard)) {
		return false;
	}	

	return Default_Helpers_Delete::delete($this->timecard);
    }
}
