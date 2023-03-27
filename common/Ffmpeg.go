package common

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

type videoS struct{}

var Ffmpeg = videoS{}

func (v videoS) GetFfmpeg() ([]byte, error) {
	cmdName := "./ffmpeg"
	args := []string{
		"-version",
	}

	cmd := exec.Command(cmdName, args...)

	output, err := cmd.CombinedOutput()
	return output, err
}

func (v videoS) GetShortcut(videoSrc string, time int) ([]byte, error) {
	cmdName := "./ffmpeg"
	args := []string{
		"-ss",
		strconv.Itoa(time),
		"-i",
		videoSrc,
		"-vframes",
		"1",
		"-loglevel",
		"quiet",
		"-f",
		"mjpeg",
		"pipe:1",
	}

	cmd := exec.Command(cmdName, args...)

	output, err := cmd.CombinedOutput()
	return output, err
}

func (v videoS) GetDuration(videoSrc string) (string, error) {
	cmdName := "./ffprobe"
	args := []string{
		"-v",
		"error",
		"-show_entries",
		"format=duration",
		"-of",
		"default=noprint_wrappers=1:nokey=1",
		"-i",
		videoSrc,
	}

	cmd := exec.Command(cmdName, args...)

	output, err := cmd.CombinedOutput()
	return strings.Trim(fmt.Sprintf("%s", output), "\r\n"), err
}

func (v videoS) ConvertStream(videoSrc string) ([]byte, error) {
	cmdName := "./ffmpeg"
	args := []string{
		"-loglevel",
		"quiet",
		"-i",
		videoSrc,
		"-c",
		"copy",
		"-f",
		"hls",
		"-hls_time",
		"2.0",
		"-hls_list_size",
		"2",
		"-hls_flags",
		"2",
		"./test.m3u8",
	}

	cmd := exec.Command(cmdName, args...)
	println(cmd.String())
	output, err := cmd.CombinedOutput()
	return output, err
}
