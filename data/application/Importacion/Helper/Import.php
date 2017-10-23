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
 * Import
 *
 */
class Importacion_Helper_Import
{
	protected $fintern, $freal, $file_path;
	
	public function log($message) {
		$fp = fopen('import_log.log', 'a') or exit("Can't open Log file");
		fwrite($fp, 
			@date('[d/M/Y:H:i:s]') . 
			"(" . pathinfo($_SERVER['PHP_SELF'], PATHINFO_FILENAME) . ")" . 
			$message . PHP_EOL);
		fclose($fp);
	}

	public function setFilePath($file_path) {
		$this->file_path = $file_path;
	}

	public function setFintern($fintern) {
		$this->fintern = $fintern;
	}

	public function setFreal($freal) {
		$this->freal = $freal;
	}

	protected function getProjectModelObject($id = null)
	{
		$model = new Project_Models_Project();		
		if($id) {
			$model->find($id);
		}
		
		return $model;
	}

	protected function getRequestObject($fields)
	{
		$request = new Zend_Controller_Request_Http();
		foreach ($fields as $key => $value) {
			$request->setParam($key, $value);
		}
		
		return $request;
	}

	protected function getDateFormat($date)
	{
		if($date) {
			return date('D M d Y H:i:s e (T)', strtotime($date));
		} else {
			return date('D M d Y H:i:s e (T)');
		}
	}
	
	protected function verifyLevelByName($name, $project_id)
	{
		$table = $this->getProjectModelObject();
		$select = "title = '$name' AND project_id = $project_id";
		$row = $table->fetchAll($select);

		if($row && $row[0]) {
			return $row[0]->id;
		}

		return false;
	}

	public function execFile()
	{
		$file = fopen($this->file_path . $this->fintern, 'r');

		//Header line		
		fgets($file);

		while(!feof($file)){
			try{
				$raw_content = fgetcsv($file);

				if(!empty($raw_content[0])) {
					// Client creation
					$str_pr = 'Creaction of client: ' . $raw_content[0];
					$id_client = $this->createClient($raw_content[0], $raw_content[5], $raw_content[6], $raw_content[7]);
				} else if(!empty($raw_content[1])) {
					// Project creation
					if($id_client) {
						$str_pr = 'Creaction of project: ' . $raw_content[1];
						$users = explode(';', str_replace('"', '', $raw_content[8]));
						$id_project = $this->createProject($raw_content[1], $raw_content[5], $raw_content[6], $raw_content[7], $id_client, $users);
					}
				} else if(!empty($raw_content[2])) {
					// Third level project creation
					if($id_project) {
						$str_pr = 'Creaction of third level: ' . $raw_content[2];
						$id_third = $this->createThirdLevel($raw_content[2], $raw_content[5], $raw_content[6], $raw_content[7], $id_project);
					}
				} else if(!empty($raw_content[3])) {
					// Fourth level project creation
					if($id_third) {
						$str_pr = 'Creaction of fourth level: ' . $raw_content[3];
						$id_fourth = $this->createFourthLevel($raw_content[3], $raw_content[5], $raw_content[6], $raw_content[7], $id_third);
					}
				} else if(!empty($raw_content[4])) {
					// Task or Activity creation
					if($id_fourth) {
						$str_pr = 'Creaction of activity: ' . $raw_content[4];
						$users = explode(';', str_replace('"', '', $raw_content[8]));
						$id_task = $this->createTask($raw_content[4], $raw_content[5], $raw_content[6], $raw_content[7], $id_fourth, $users);
					}
				}
			} catch (Zend_Controller_Action_Exception $error) {
				$this->log('Error while ' . $str_pr . ' with ' . $error->getMessage());
				$this->log('Row content: ' . print_r($raw_content, true));
			}
		}

		return true;
	}

	protected function createClient($name, $desc, $start, $end)
	{
		$existing_client = $this->verifyLevelByName($name, 1);
		if($existing_client) {
			return $existing_client;
		}

		$model   = $this->getProjectModelObject();
		
		$request = $this->getRequestObject(array('projectId' => '1',
							 'title' => utf8_encode($name),
							 'notes' => utf8_encode($desc),
							 'startDate' => $this->getDateFormat($start),
							 'endDate' => $this->getDateFormat($end),
							 'moduleRelation' => array(	1 => 'Project', 
											4 => 'Filemanager',
											5 => 'Gantt',
											6 => 'Helpdesk',
											7 => 'Minutes',
											8 => 'Note',
											9 => 'Statistic',
											11 => 'Todo'),
							 'checkModuleRelation' => array(1 => 1,
											4 => 1,
											5 => 1,
											6 => 1,
											7 => 1,
											8 => 1,
											9 => 1,
											11 => 1) ));
		$TimeTracker = new My_Timetracker();
		$parameters = $TimeTracker->execCreatorAction(	$this->getProjectModelObject(), 
								$request,
								new Phprojekt_User_User());

		if ($model instanceof Phprojekt_Model_Interface) {
            		$node    = new Phprojekt_Tree_Node_Database($model, 0);
            		$newNode = Default_Helpers_Save::save($node, $parameters,
                		(int) $request->getParam('projectId', null));
		}

		return $newNode->id;	
	}

	protected function createProject($name, $desc, $start, $end, $id_client, $users)
	{
		$existing_project = $this->verifyLevelByName($name, $id_client);
		if($existing_project) {
			return $existing_project;
		}
		
		$model   = $this->getProjectModelObject();
		
		$request = $this->getRequestObject(array('projectId' => $id_client,
							 'title' => utf8_encode($name),
							 'notes' => utf8_encode($desc),
							 'startDate' => $this->getDateFormat($start),
							 'endDate' => $this->getDateFormat($end),
							 'dataAccess' => $users,
							 'moduleRelation' => array(	1 => 'Project', 
											4 => 'Filemanager',
											5 => 'Gantt',
											6 => 'Helpdesk',
											7 => 'Minutes',
											8 => 'Note',
											9 => 'Statistic',
											11 => 'Todo'),
							 'checkModuleRelation' => array(1 => 1,
											4 => 1,
											5 => 1,
											6 => 1,
											7 => 1,
											8 => 1,
											9 => 1,
											11 => 1) ));
		$TimeTracker = new My_Timetracker();
		$parameters = $TimeTracker->execCreatorAction(	$this->getProjectModelObject(), 
								$request,
								new Phprojekt_User_User());

		if ($model instanceof Phprojekt_Model_Interface) {
            		$node    = new Phprojekt_Tree_Node_Database($model, 0);
            		$newNode = Default_Helpers_Save::save($node, $parameters,
                		(int) $request->getParam('projectId', null));
		}
		
		return $newNode->id;	
	}

	protected function createThirdLevel($name, $desc, $start, $end, $id_project)
	{
		$existing_level = $this->verifyLevelByName($name, $id_project);
		if($existing_level) {
			return $existing_level;
		}
		
		$model   = $this->getProjectModelObject();
		
		$request = $this->getRequestObject(array('projectId' => $id_project,
							 'title' => utf8_encode($name),
							 'notes' => utf8_encode($desc),
							 'startDate' => $this->getDateFormat($start),
							 'endDate' => $this->getDateFormat($end),
							 'moduleRelation' => array(	1 => 'Project', 
											4 => 'Filemanager',
											5 => 'Gantt',
											6 => 'Helpdesk',
											7 => 'Minutes',
											8 => 'Note',
											9 => 'Statistic',
											11 => 'Todo'),
							 'checkModuleRelation' => array(1 => 1,
											4 => 1,
											5 => 1,
											6 => 1,
											7 => 1,
											8 => 1,
											9 => 1,
											11 => 1) ));
		if ($model instanceof Phprojekt_Model_Interface) {
            		$node    = new Phprojekt_Tree_Node_Database($model, 0);
            		$newNode = Default_Helpers_Save::save($node, $request->getParams(),
                		(int) $request->getParam('projectId', null));
		}

		return $newNode->id;	
	}


	protected function createFourthLevel($name, $desc, $start, $end, $id_third)
	{
		$existing_level = $this->verifyLevelByName($name, $id_third);
		if($existing_level) {
			return $existing_level;
		}
		
		$model   = $this->getProjectModelObject();
		
		$request = $this->getRequestObject(array('projectId' => $id_third,
							 'title' => utf8_encode($name),
							 'notes' => utf8_encode($desc),
							 'startDate' => $this->getDateFormat($start),
							 'endDate' => $this->getDateFormat($end),
							 'moduleRelation' => array(	1 => 'Project', 
											4 => 'Filemanager',
											5 => 'Gantt',
											6 => 'Helpdesk',
											7 => 'Minutes',
											8 => 'Note',
											9 => 'Statistic',
											11 => 'Todo'),
							 'checkModuleRelation' => array(1 => 1,
											4 => 1,
											5 => 1,
											6 => 1,
											7 => 1,
											8 => 1,
											9 => 1,
											11 => 1) ));
		if ($model instanceof Phprojekt_Model_Interface) {
            		$node    = new Phprojekt_Tree_Node_Database($model, 0);
            		$newNode = Default_Helpers_Save::save($node, $request->getParams(),
                		(int) $request->getParam('projectId', null));
		}

		return $newNode->id;	
	}

	protected function createTask($name, $desc, $start, $end, $id_fourth, $users)
	{
		$existing_task = $this->verifyLevelByName($name, $id_fourth);
		if($existing_task) {
			return $existing_task;
		}
		
		$model   = $this->getProjectModelObject();
		
		$request = $this->getRequestObject(array('projectId' => $id_fourth,
							 'title' => utf8_encode($name),
							 'notes' => utf8_encode($desc),
							 'startDate' => $this->getDateFormat($start),
							 'endDate' => $this->getDateFormat($end),
							 'dataAccess' => $users,
							 'moduleRelation' => array(	1 => 'Project', 
											4 => 'Filemanager',
											5 => 'Gantt',
											6 => 'Helpdesk',
											7 => 'Minutes',
											8 => 'Note',
											9 => 'Statistic',
											11 => 'Todo'),
							 'checkModuleRelation' => array(1 => 1,
											4 => 1,
											5 => 1,
											6 => 1,
											7 => 1,
											8 => 1,
											9 => 1,
											11 => 1) ));
		$TimeTracker = new My_Timetracker();
		$parameters = $TimeTracker->execCreatorAction(	$this->getProjectModelObject(), 
								$request,
								new Phprojekt_User_User());

		if ($model instanceof Phprojekt_Model_Interface) {
            		$node    = new Phprojekt_Tree_Node_Database($model, 0);
            		$newNode = Default_Helpers_Save::save($node, $parameters,
                		(int) $request->getParam('projectId', null));
		}
		
		return $newNode->id;	
	}
}
